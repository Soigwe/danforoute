// Main UI Controller, Leaflet Canvas & GNSS Engine
let map;
let activeMapLayers = [];
let inactiveMapLayers = [];
let currentPosMarker = null;
let activeFullRoadCoords = [];
let isSheetExpanded = false;
let calculatedRoutes = [];
let activeRouteIdx = 0;

function initMap() {
    map = L.map('map', { zoomControl: false }).setView([6.5244, 3.3792], 11);
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=cb1_42eu_1_6d0ada7c3bd84d557366ff2c', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19
    }).addTo(map);
}

function clearMapLayers() {
    activeMapLayers.forEach(l => map.removeLayer(l));
    inactiveMapLayers.forEach(l => map.removeLayer(l));
    activeMapLayers = [];
    inactiveMapLayers = [];
}

function populateDropdowns() {
    const orig = document.getElementById('origin-select');
    const dest = document.getElementById('dest-select');
    const sorted = Object.keys(HUBS).sort((a, b) => HUBS[a].name.localeCompare(HUBS[b].name));
    
    sorted.forEach(k => {
        orig.add(new Option(`${HUBS[k].name} (${HUBS[k].zone})`, k));
        dest.add(new Option(`${HUBS[k].name} (${HUBS[k].zone})`, k));
    });

    orig.value = "ELEKO";
    dest.value = "MILE2";
}

function toggleSearchModal() {
    const m = document.getElementById('search-modal');
    m.classList.toggle('hidden');
}

function toggleSheetExpand() {
    const sheet = document.getElementById('bottom-sheet');
    const label = document.getElementById('expand-label');
    isSheetExpanded = !isSheetExpanded;
    if (isSheetExpanded) {
        sheet.style.maxHeight = '75vh';
        label.innerHTML = '<span>Collapse</span> <span>▲</span>';
    } else {
        sheet.style.maxHeight = window.innerWidth < 768 ? '170px' : '220px';
        label.innerHTML = '<span>Details</span> <span>▼</span>';
    }
}

function quickSet(u, v) {
    document.getElementById('origin-select').value = u;
    document.getElementById('dest-select').value = v;
    executeRouteSearch();
}

function swapLocations() {
    const o = document.getElementById('origin-select');
    const d = document.getElementById('dest-select');
    const t = o.value; o.value = d.value; d.value = t;
}

function getModeColor(mode) {
    switch(mode) {
        case 'rail': return '#2563eb';
        case 'brt': return '#e11d48';
        case 'ferry': return '#0d9488';
        default: return '#f59e0b';
    }
}

function getModeIcon(mode) {
    switch(mode) {
        case 'rail': return '🚆';
        case 'brt': return '🔴';
        case 'ferry': return '⛴️';
        default: return '🚐';
    }
}

async function executeRouteSearch() {
    document.getElementById('search-modal').classList.add('hidden');
    
    const start = document.getElementById('origin-select').value;
    const target = document.getElementById('dest-select').value;
    
    document.getElementById('top-bar-sub').innerText = `${HUBS[start].name.split(' ')[0]} → ${HUBS[target].name.split(' ')[0]}`;

    calculatedRoutes = findDiverseAlternativeRoutes(start, target);
    if (calculatedRoutes.length === 0) {
        alert("No transit paths found between these stops.");
        return;
    }

    document.getElementById('route-count-label').innerText = `${calculatedRoutes.length} Available Options (Ranked)`;

    const carousel = document.getElementById('route-cards-carousel');
    carousel.innerHTML = '';

    calculatedRoutes.forEach((route, idx) => {
        const card = document.createElement('div');
        card.className = `flex-shrink-0 w-44 p-2.5 rounded-2xl border cursor-pointer transition-all duration-200 select-none ${idx === 0 ? 'bg-white border-slate-900 shadow-md ring-2 ring-slate-900/10' : 'bg-slate-100/80 border-slate-200 hover:bg-white'}`;
        card.id = `carousel-card-${idx}`;
        card.onclick = () => selectActiveRoute(idx);

        const modeIcons = [...new Set(route.steps.map(s => getModeIcon(s.mode)))].join(' ');

        card.innerHTML = `
            <div class="flex justify-between items-center mb-1">
                <span class="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${route.tagBg}">${route.tag}</span>
                <span class="text-xs font-black text-slate-900">₦${route.totalFare.toLocaleString()}</span>
            </div>
            <div class="flex items-center gap-1 my-0.5 text-xs">${modeIcons}</div>
            <div class="flex justify-between items-center text-[10px] text-slate-500 font-bold">
                <span class="text-emerald-600">⏱ ~${route.totalTime}m</span>
                <span>${route.steps.length} legs</span>
            </div>
        `;
        carousel.appendChild(card);
    });

    await selectActiveRoute(0);
}

async function selectActiveRoute(idx) {
    activeRouteIdx = idx;
    const route = calculatedRoutes[idx];

    calculatedRoutes.forEach((_, i) => {
        const el = document.getElementById(`carousel-card-${i}`);
        if (el) {
            if (i === idx) {
                el.className = 'flex-shrink-0 w-44 p-2.5 rounded-2xl border cursor-pointer transition-all duration-200 select-none bg-white border-slate-900 shadow-md ring-2 ring-slate-900/10 transform scale-[1.02]';
            } else {
                el.className = 'flex-shrink-0 w-44 p-2.5 rounded-2xl border cursor-pointer transition-all duration-200 select-none bg-slate-100/80 border-slate-200 hover:bg-white opacity-75';
            }
        }
    });

    document.getElementById('active-route-name').innerText = route.title;
    document.getElementById('active-route-fare').innerText = `₦${route.totalFare.toLocaleString()}`;
    document.getElementById('active-route-time').innerText = `⏱ ~${route.totalTime} mins`;

    const stepsContainer = document.getElementById('steps-container');
    stepsContainer.innerHTML = route.steps.map((step, sIdx) => `
        <div class="relative pl-3 pb-2">
            <span class="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm" style="background-color: ${getModeColor(step.mode)}"></span>
            <div class="flex justify-between items-baseline">
                <h4 class="text-xs font-black text-slate-900">${sIdx + 1}. ${HUBS[step.from].name} → ${HUBS[step.to].name}</h4>
                <span class="text-[11px] font-extrabold text-slate-700">₦${step.fare}</span>
            </div>
            <p class="text-[11px] text-slate-500 mt-0.5">${step.desc}</p>
            <div class="flex gap-2 mt-1">
                <span class="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">⏱ ~${step.time} mins</span>
                <span class="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded" style="background-color: ${getModeColor(step.mode)}20; color: ${getModeColor(step.mode)}">${step.mode}</span>
            </div>
        </div>
    `).join('');

    await renderMapRoutes();
}

async function renderMapRoutes() {
    clearMapLayers();
    activeFullRoadCoords = [];

    // Inactive paths
    for (let i = 0; i < calculatedRoutes.length; i++) {
        if (i === activeRouteIdx) continue;
        const otherRoute = calculatedRoutes[i];
        for (const step of otherRoute.steps) {
            const fromCoords = HUBS[step.from].coords;
            const toCoords = HUBS[step.to].coords;
            const roadCoords = await fetchRealRoadPath(fromCoords, toCoords, step.mode);
            
            const bgLine = L.polyline(roadCoords, {
                color: '#94a3b8',
                weight: 4,
                opacity: 0.4,
                dashArray: '6, 6'
            }).addTo(map);
            inactiveMapLayers.push(bgLine);
        }
    }

    // Active path
    const currentRoute = calculatedRoutes[activeRouteIdx];
    for (let i = 0; i < currentRoute.steps.length; i++) {
        const step = currentRoute.steps[i];
        const fromCoords = HUBS[step.from].coords;
        const toCoords = HUBS[step.to].coords;
        const color = getModeColor(step.mode);

        const roadCoords = await fetchRealRoadPath(fromCoords, toCoords, step.mode);
        activeFullRoadCoords.push(...roadCoords);

        const line = L.polyline(roadCoords, {
            color: color,
            weight: 6,
            opacity: 0.95,
            lineJoin: 'round',
            lineCap: 'round',
            className: 'animated-route-line',
            dashArray: step.mode === 'danfo' ? '6, 10' : null
        }).addTo(map);
        activeMapLayers.push(line);

        const mk = L.circleMarker(fromCoords, {
            radius: 7,
            fillColor: color,
            color: "#ffffff",
            weight: 2,
            fillOpacity: 1
        }).addTo(map).bindPopup(`<strong class="text-xs">${HUBS[step.from].name}</strong><br><span class="text-[10px] text-slate-500">${step.desc}</span>`);
        activeMapLayers.push(mk);

        if (i === currentRoute.steps.length - 1) {
            const destMk = L.circleMarker(toCoords, {
                radius: 8,
                fillColor: "#0f172a",
                color: "#ffffff",
                weight: 2,
                fillOpacity: 1
            }).addTo(map).bindPopup(`<strong class="text-xs">Destination: ${HUBS[step.to].name}</strong>`);
            activeMapLayers.push(destMk);
        }
    }

    if (activeFullRoadCoords.length > 0) {
        map.fitBounds(L.latLngBounds(activeFullRoadCoords), {
            paddingTopLeft: [40, 40],
            paddingBottomRight: [40, window.innerWidth < 768 ? 200 : 120]
        });
    }
}

function startNavigation(e) {
    e.stopPropagation();
    const btn = document.getElementById('nav-btn');
    btn.innerHTML = '<span>🛰️</span> <span class="animate-pulse">Live Road Navigation Active...</span>';
    btn.className = 'w-full bg-emerald-600 text-white py-3 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md';

    const gnssIcon = L.divIcon({
        className: '',
        html: '<div class="gps-indicator"></div>',
        iconSize: [18, 18], iconAnchor: [9, 9]
    });

    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(pos => {
            const lat = pos.coords.latitude, lng = pos.coords.longitude;
            if (!currentPosMarker) {
                currentPosMarker = L.marker([lat, lng], {icon: gnssIcon}).addTo(map);
                activeMapLayers.push(currentPosMarker);
            } else {
                currentPosMarker.setLatLng([lat, lng]);
            }
            map.panTo([lat, lng]);
        }, err => {
            simulateRoadGPS();
        }, { enableHighAccuracy: true });
    } else {
        simulateRoadGPS();
    }
}

function simulateRoadGPS() {
    if (activeFullRoadCoords.length === 0) return;

    const gnssIcon = L.divIcon({ className: '', html: '<div class="gps-indicator"></div>', iconSize: [18, 18], iconAnchor: [9, 9] });
    let idx = 0;
    if (!currentPosMarker) {
        currentPosMarker = L.marker(activeFullRoadCoords[idx], {icon: gnssIcon}).addTo(map);
        activeMapLayers.push(currentPosMarker);
    }

    setInterval(() => {
        idx = (idx + 1) % activeFullRoadCoords.length;
        currentPosMarker.setLatLng(activeFullRoadCoords[idx]);
        map.panTo(activeFullRoadCoords[idx]);
    }, 1000);
}

window.onload = () => {
    initMap();
    populateDropdowns();
    executeRouteSearch();
};
