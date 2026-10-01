// Pan-Lagos Public Transit Nodes & Network Edges
const HUBS = {
    "ELEKO": { name: "Eleko Junction", zone: "Ibeju-Lekki", coords: [6.4700, 3.8600] },
    "EPE": { name: "Epe T-Junction", zone: "Epe Axis", coords: [6.5840, 3.9830] },
    "SANGOTEDO": { name: "Sangotedo / Novare Mall", zone: "Ajah Axis", coords: [6.4712, 3.6300] },
    "AJAH": { name: "Ajah Underbridge", zone: "Island East", coords: [6.4673, 3.5651] },
    "CHEVRON": { name: "Chevron Toll", zone: "Lekki", coords: [6.4380, 3.5350] },
    "LEKKI1": { name: "Lekki Phase 1 Gate", zone: "Lekki", coords: [6.4474, 3.4731] },
    "VI": { name: "Victoria Island (Eko Hotel)", zone: "Island", coords: [6.4281, 3.4219] },
    "OBALENDE": { name: "Obalende Terminal", zone: "Island", coords: [6.4502, 3.4150] },
    "CMS": { name: "CMS / Marina Hub & Metro", zone: "Island Central", coords: [6.4531, 3.3888] },
    "MILE2": { name: "Mile 2 Interchange & Rail", zone: "Mainland West", coords: [6.4627, 3.3032] },
    "FESTAC": { name: "Festac 1st Gate", zone: "Mainland West", coords: [6.4680, 3.2850] },
    "ORILE": { name: "Orile Rail Station", zone: "Mainland West", coords: [6.4710, 3.3420] },
    "COSTAIN": { name: "Costain / Eko Bridge", zone: "Mainland South", coords: [6.4810, 3.3680] },
    "SURULERE": { name: "Ojuelegba / Stadium", zone: "Surulere", coords: [6.5050, 3.3600] },
    "YABA": { name: "Yaba Tech / Tejuosho", zone: "Mainland Central", coords: [6.5167, 3.3765] },
    "OYINGBO": { name: "Oyingbo Terminal", zone: "Mainland Central", coords: [6.4800, 3.3830] },
    "OSHODI": { name: "Oshodi Transport Interchange", zone: "Interchange", coords: [6.5540, 3.3540] },
    "IKEJA": { name: "Ikeja Underbridge / Terminal", zone: "Capital Hub", coords: [6.5960, 3.3420] },
    "MARYLAND": { name: "Maryland BRT Hub", zone: "Mainland Central", coords: [6.5700, 3.3680] },
    "OJOTA": { name: "Ojota Main Terminal", zone: "Interchange", coords: [6.5850, 3.3860] },
    "KETU": { name: "Ketu Garage", zone: "Ikorodu Axis", coords: [6.6020, 3.3910] },
    "IKORODU": { name: "Ikorodu Garage & BRT", zone: "Ikorodu Axis", coords: [6.6180, 3.5080] },
    "BERGER": { name: "Berger Terminal", zone: "Interstate Link", coords: [6.6450, 3.3700] },
    "AGEGE": { name: "Agege Pen Cinema Rail", zone: "Mainland North", coords: [6.6200, 3.3280] },
    "ABULE_EGBA": { name: "Abule Egba BRT", zone: "Alimosho", coords: [6.6500, 3.2820] },
    "IYANA_IPAJA": { name: "Iyana Ipaja Main Garage", zone: "Alimosho", coords: [6.6110, 3.2790] },
    "EGBEDA": { name: "Egbeda Bus Stop", zone: "Alimosho", coords: [6.5920, 3.2880] },
    "IKOTUN": { name: "Ikotun Market", zone: "Alimosho", coords: [6.5560, 3.2680] },
    "IYANA_IBA": { name: "Iyana Iba / LASU Gate", zone: "Badagry Axis", coords: [6.4710, 3.1950] },
    "BADAGRY": { name: "Badagry Roundabout", zone: "Badagry Axis", coords: [6.4310, 2.8870] }
};

const EDGES = [
    { u: "EPE", v: "ELEKO", mode: "danfo", fare: 700, time: 25, desc: "Danfo along Lekki-Epe Expressway" },
    { u: "ELEKO", v: "SANGOTEDO", mode: "danfo", fare: 400, time: 20, desc: "Korope to Novare Mall / Sangotedo" },
    { u: "SANGOTEDO", v: "AJAH", mode: "danfo", fare: 300, time: 15, desc: "Danfo into Ajah Underbridge" },
    { u: "ELEKO", v: "AJAH", mode: "danfo", fare: 600, time: 30, desc: "Direct Coaster to Ajah Underbridge" },
    { u: "AJAH", v: "CHEVRON", mode: "danfo", fare: 200, time: 10, desc: "Danfo along Lekki corridor" },
    { u: "CHEVRON", v: "LEKKI1", mode: "danfo", fare: 300, time: 15, desc: "Danfo to Lekki Phase 1 Gate" },
    { u: "LEKKI1", v: "VI", mode: "danfo", fare: 300, time: 15, desc: "Danfo to Victoria Island" },
    { u: "LEKKI1", v: "OBALENDE", mode: "danfo", fare: 400, time: 20, desc: "Danfo via Lekki-Ikoyi Link Bridge" },
    { u: "AJAH", v: "CMS", mode: "danfo", fare: 800, time: 45, desc: "Direct Bus to CMS / Marina" },
    { u: "AJAH", v: "OSHODI", mode: "danfo", fare: 1000, time: 55, desc: "Direct Danfo via 3rd Mainland Bridge" },
    { u: "OBALENDE", v: "CMS", mode: "danfo", fare: 200, time: 10, desc: "Short transit hop to CMS" },
    
    // Blue Line Metro & Pure Road links
    { u: "CMS", v: "MILE2", mode: "rail", fare: 750, time: 20, desc: "LRMT Blue Line Metro (Marina to Mile 2 - 0 Traffic)" },
    { u: "CMS", v: "MILE2", mode: "danfo", fare: 600, time: 50, desc: "Direct Danfo / Coaster via Eko Bridge & Orile to Mile 2" },
    { u: "CMS", v: "ORILE", mode: "rail", fare: 500, time: 12, desc: "LRMT Blue Line Train" },
    { u: "ORILE", v: "MILE2", mode: "rail", fare: 400, time: 8, desc: "LRMT Blue Line Train" },
    { u: "MILE2", v: "FESTAC", mode: "danfo", fare: 200, time: 10, desc: "Keke / Danfo into Festac" },
    { u: "MILE2", v: "IYANA_IBA", mode: "danfo", fare: 500, time: 30, desc: "Danfo from Mile 2 Oke to LASU/Iba" },
    { u: "IYANA_IBA", v: "BADAGRY", mode: "danfo", fare: 800, time: 45, desc: "Direct Danfo to Badagry" },

    // Central / Mainland Links
    { u: "CMS", v: "COSTAIN", mode: "danfo", fare: 300, time: 15, desc: "Danfo via Eko Bridge to Costain" },
    { u: "COSTAIN", v: "MILE2", mode: "danfo", fare: 400, time: 30, desc: "Danfo from Costain / National Theatre to Mile 2" },
    { u: "COSTAIN", v: "SURULERE", mode: "danfo", fare: 250, time: 12, desc: "Danfo to Ojuelegba / Stadium" },
    { u: "SURULERE", v: "YABA", mode: "danfo", fare: 200, time: 10, desc: "Danfo / Keke to Yaba Tech" },
    { u: "CMS", v: "YABA", mode: "brt", fare: 400, time: 25, desc: "BRT via Carter Bridge to Yaba" },
    { u: "YABA", v: "MARYLAND", mode: "brt", fare: 300, time: 15, desc: "BRT Corridor along Ikorodu Rd" },
    { u: "MARYLAND", v: "OJOTA", mode: "brt", fare: 200, time: 8, desc: "BRT lane to Ojota" },
    { u: "CMS", v: "IKORODU", mode: "brt", fare: 900, time: 50, desc: "Direct BRT from Marina to Ikorodu" },
    { u: "CMS", v: "IKORODU", mode: "ferry", fare: 1500, time: 35, desc: "Water Ferry from Marina Jetty to Ikorodu" },
    { u: "OJOTA", v: "IKORODU", mode: "brt", fare: 500, time: 30, desc: "Direct BRT corridor to Ikorodu Garage" },

    // Oshodi Interchange Axis
    { u: "MILE2", v: "OSHODI", mode: "danfo", fare: 500, time: 25, desc: "Danfo via Oshodi-Apapa Expressway (Cele, Iyana-Itire)" },
    { u: "YABA", v: "OSHODI", mode: "danfo", fare: 350, time: 20, desc: "Danfo from Yaba / Jibowu to Oshodi" },
    { u: "OSHODI", v: "IKEJA", mode: "danfo", fare: 300, time: 15, desc: "Danfo / BRT to Ikeja Underbridge" },
    { u: "IKEJA", v: "VI", mode: "danfo", fare: 800, time: 40, desc: "Direct Danfo / AC Coaster to VI" },
    { u: "OSHODI", v: "MARYLAND", mode: "danfo", fare: 300, time: 15, desc: "Danfo to Maryland Mall" },
    { u: "IKEJA", v: "BERGER", mode: "danfo", fare: 400, time: 20, desc: "Danfo to Berger Interstate Terminal" },
    { u: "OJOTA", v: "BERGER", mode: "danfo", fare: 300, time: 15, desc: "Danfo along Expressway to Berger" },
    { u: "IKEJA", v: "AGEGE", mode: "danfo", fare: 300, time: 15, desc: "Danfo to Pen Cinema Agege" },
    { u: "AGEGE", v: "ABULE_EGBA", mode: "brt", fare: 250, time: 12, desc: "BRT to Abule Egba" },
    { u: "OSHODI", v: "ABULE_EGBA", mode: "brt", fare: 500, time: 25, desc: "Dedicated Oshodi-Abule Egba BRT Lane" },
    { u: "OSHODI", v: "IYANA_IPAJA", mode: "danfo", fare: 400, time: 25, desc: "Danfo to Iyana Ipaja Garage" },
    { u: "IYANA_IPAJA", v: "EGBEDA", mode: "danfo", fare: 200, time: 10, desc: "Danfo to Egbeda" },
    { u: "EGBEDA", v: "IKOTUN", mode: "danfo", fare: 250, time: 12, desc: "Danfo to Ikotun Market" },
    { u: "MILE2", v: "IKOTUN", mode: "danfo", fare: 450, time: 30, desc: "Danfo via Ago Palace Way to Ikotun" }
];

const GRAPH = {};
Object.keys(HUBS).forEach(k => GRAPH[k] = []);
EDGES.forEach((e, edgeIdx) => {
    GRAPH[e.u].push({ id: edgeIdx, to: e.v, mode: e.mode, fare: e.fare, time: e.time, desc: e.desc });
    GRAPH[e.v].push({ id: edgeIdx, to: e.u, mode: e.mode, fare: e.fare, time: e.time, desc: e.desc });
});
