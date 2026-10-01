// OSRM Road Geometry Cache & Dijkstra Multi-Route Solver
const routeRoadCache = {};

async function fetchRealRoadPath(fromCoords, toCoords, mode) {
    const cacheKey = `${fromCoords.join(',')}_${toCoords.join(',')}_${mode}`;
    if (routeRoadCache[cacheKey]) return routeRoadCache[cacheKey];

    if (mode === 'rail') {
        const track = [
            [6.4531, 3.3888], // Marina Hub
            [6.4630, 3.3710], // National Theatre
            [6.4710, 3.3420], // Orile Iganmu
            [6.4670, 3.3220], // Alaba Rail
            [6.4627, 3.3032]  // Mile 2 Station
        ];
        routeRoadCache[cacheKey] = track;
        return track;
    }
    if (mode === 'ferry') {
        const waterTrack = [
            [6.4531, 3.3888], [6.4750, 3.4000], [6.5400, 3.4400], [6.6180, 3.5080]
        ];
        routeRoadCache[cacheKey] = waterTrack;
        return waterTrack;
    }

    try {
        const url = `https://router.project-osrm.org/route/v1/driving/${fromCoords[1]},${fromCoords[0]};${toCoords[1]},${toCoords[0]}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes && data.routes[0] && data.routes[0].geometry) {
            const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
            routeRoadCache[cacheKey] = coords;
            return coords;
        }
    } catch (err) {
        console.warn("OSRM routing fallback:", err);
    }
    return [fromCoords, toCoords];
}

function findDiverseAlternativeRoutes(start, target) {
    const routes = [];

    const solveDijkstra = (options = {}) => {
        const dist = {}, prev = {}, pq = [];
        Object.keys(HUBS).forEach(n => { dist[n] = Infinity; prev[n] = null; });
        dist[start] = 0;
        pq.push({ node: start, cost: 0 });

        while (pq.length > 0) {
            pq.sort((a, b) => a.cost - b.cost);
            const { node: current, cost } = pq.shift();
            if (current === target) break;
            if (cost > dist[current]) continue;

            (GRAPH[current] || []).forEach(edge => {
                if (options.banModes && options.banModes.includes(edge.mode)) return;
                if (options.banEdges && options.banEdges.includes(edge.id)) return;

                let edgeCost = edge[options.weightKey || 'time'];
                if (options.preferRail && edge.mode === 'rail') edgeCost *= 0.5;
                if (options.preferDanfo && edge.mode === 'danfo') edgeCost *= 0.8;

                const newCost = dist[current] + edgeCost;
                if (newCost < dist[edge.to]) {
                    dist[edge.to] = newCost;
                    prev[edge.to] = { from: current, edge: edge };
                    pq.push({ node: edge.to, cost: newCost });
                }
            });
        }

        if (dist[target] === Infinity) return null;
        const steps = [];
        let curr = target;
        while (prev[curr]) {
            steps.unshift({ from: prev[curr].from, to: curr, ...prev[curr].edge });
            curr = prev[curr].from;
        }
        return steps;
    };

    // Option 1: Fastest
    const r1Steps = solveDijkstra({ weightKey: 'time', preferRail: true });
    if (r1Steps) {
        routes.push({
            title: 'Recommended (Fastest)',
            tag: 'Best Choice',
            tagBg: 'bg-emerald-500 text-white',
            steps: r1Steps,
            totalFare: r1Steps.reduce((a, s) => a + s.fare, 0),
            totalTime: r1Steps.reduce((a, s) => a + s.time, 0)
        });
    }

    // Option 2: Pure Danfo Road
    const r2Steps = solveDijkstra({ weightKey: 'time', banModes: ['rail', 'ferry'] });
    if (r2Steps && JSON.stringify(r2Steps.map(s => s.to)) !== JSON.stringify(r1Steps?.map(s => s.to))) {
        routes.push({
            title: 'Pure Danfo Road Route',
            tag: 'Danfo Only',
            tagBg: 'bg-amber-400 text-amber-950',
            steps: r2Steps,
            totalFare: r2Steps.reduce((a, s) => a + s.fare, 0),
            totalTime: r2Steps.reduce((a, s) => a + s.time, 0)
        });
    }

    // Option 3: Interchange Alternative
    if (r1Steps && r1Steps.length > 0) {
        const usedEdgeIds = r1Steps.map(s => s.id);
        const r3Steps = solveDijkstra({ weightKey: 'time', banEdges: usedEdgeIds.slice(0, 2) });
        if (r3Steps && !routes.some(r => JSON.stringify(r.steps.map(s => s.to)) === JSON.stringify(r3Steps.map(s => s.to)))) {
            routes.push({
                title: 'Alternative Transit Corridor',
                tag: 'Alternative',
                tagBg: 'bg-slate-200 text-slate-800',
                steps: r3Steps,
                totalFare: r3Steps.reduce((a, s) => a + s.fare, 0),
                totalTime: r3Steps.reduce((a, s) => a + s.time, 0)
            });
        }
    }

    // Option 4: Cheapest
    const r4Steps = solveDijkstra({ weightKey: 'fare' });
    if (r4Steps && !routes.some(r => JSON.stringify(r.steps.map(s => s.to)) === JSON.stringify(r4Steps.map(s => s.to)))) {
        routes.push({
            title: 'Budget Commute',
            tag: 'Cheapest',
            tagBg: 'bg-blue-500 text-white',
            steps: r4Steps,
            totalFare: r4Steps.reduce((a, s) => a + s.fare, 0),
            totalTime: r4Steps.reduce((a, s) => a + s.time, 0)
        });
    }

    routes.sort((a, b) => a.totalTime - b.totalTime);
    return routes;
}
