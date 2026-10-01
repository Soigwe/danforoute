// Lagos Transit AI Co-pilot Logic
function toggleAI() {
    const m = document.getElementById('ai-modal');
    m.classList.toggle('hidden');
    m.classList.toggle('flex');
}

function sendAI() {
    const inp = document.getElementById('ai-input');
    const chat = document.getElementById('ai-chat');
    const text = inp.value.trim();
    if (!text) return;

    chat.innerHTML += `<div class="bg-slate-900 text-white p-2.5 rounded-2xl rounded-tr-none self-end text-xs ml-auto w-10/12 mb-1.5 font-medium">${text}</div>`;
    inp.value = '';
    chat.scrollTop = chat.scrollHeight;

    setTimeout(() => {
        let reply = "Keep small change (₦200, ₦500) handy for Danfo conductors and top up your Cowry Card for Blue Line Rail and BRT lanes.";
        if (text.toLowerCase().includes("rain") || text.toLowerCase().includes("surge")) {
            reply = "🌧️ During rain, Lekki-Epe expressway Danfo fares surge by ₦300–₦500. The Blue Line train is immune to rain delays and surges.";
        } else if (text.toLowerCase().includes("traffic") || text.toLowerCase().includes("bridge")) {
            reply = "🚗 3rd Mainland Bridge is moving well westbound. Eko bridge has typical slowdown around Costain junction.";
        }
        chat.innerHTML += `<div class="bg-slate-100 text-slate-800 p-2.5 rounded-2xl rounded-tl-none self-start text-xs w-11/12 mb-1.5 border border-slate-200/60"><b>AI Advisor:</b> ${reply}</div>`;
        chat.scrollTop = chat.scrollHeight;
    }, 800);
}
