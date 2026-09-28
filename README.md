# DanfoRoute Lagos 🚌

> **Pan-Lagos Multi-Modal Public Transit & Intermodal Router**

DanfoRoute is a web and mobile-friendly transit navigator engineered specifically for Lagos State commuters. It models and routes across **30+ major transit hubs**, integrating **Danfo (minibus), BRT corridors, Lagos Rail Mass Transit (LRMT Blue & Red Lines), and Water Ferries (LASWA)**.

---

## ⚡ Key Features

- **Pan-Lagos Multi-Modal Graph Engine**: Dijkstra shortest-path calculation between any two major hubs across the Island, Mainland, Badagry corridor, and Ikorodu.
- **Intermodal Routing & Modes**:
  - 🟡 **Danfo & Korope** (Expressway & inner-city routes)
  - 🔴 **Dedicated BRT Lanes** (Ikorodu, TBS, Abule Egba, Oshodi)
  - 🔵 **LRMT Blue Line Metro Rail** (Marina $\leftrightarrow$ Mile 2)
  - 🟢 **Water Ferries** (Marina Jetty $\leftrightarrow$ Ikorodu Jetty)
- **Real-Time Fare & Duration Estimates**: Accurate local estimates in Nigerian Naira (₦) with traffic bypass optimizations.
- **Live GNSS / GPS Tracking**: Live location pin tracking with step-by-step navigation cues.
- **Lagos Transit AI Assistant**: Integrated localized AI co-pilot for weather/rain fare surges, late-night safety advice, and transfer tips.
- **Modern Minimalist UI**: Mobile-first, Apple Maps / Citymapper inspired aesthetic with dark/light mode accents and interactive Leaflet map canvas.

---

## 🚀 Quick Start

1. Clone this repository:
   ```bash
   git clone https://github.com/Soigwe/danforoute.git
   cd danforoute
   ```

2. Serve locally:
   ```bash
   python3 -m http.server 8080
   ```

3. Open `http://localhost:8080` in your browser.

---

## 🗺️ Coverage Hubs & Parks

- **Island / Lekki / Epe**: *Eleko Junction, Epe T-Junction, Sangotedo, Ajah Underbridge, Chevron, Lekki Phase 1, Victoria Island, Obalende Terminal, CMS / Marina Hub & Metro.*
- **Mainland West & Badagry**: *Mile 2 Interchange, Festac 1st Gate, Orile Iganmu Rail, Costain, Trade Fair, Iyana Iba / LASU, Badagry Roundabout.*
- **Mainland Central**: *Surulere / Ojuelegba, Yaba Hub & Rail, Oyingbo Terminal, Mushin, Maryland BRT Hub, Anthony, Fadeyi.*
- **Mainland North & Alimosho**: *Oshodi Interchange (Terminals 1–3), Ikeja Bus Terminal, Agege Pen Cinema, Berger Terminal, Abule Egba BRT Hub, Iyana Ipaja, Egbeda, Ikotun Market.*
- **Ikorodu Axis**: *Ikorodu Garage & BRT, Agric, Ketu, Ojota Main Terminal.*

---

## 🛠️ Stack

- **Frontend**: HTML5, Tailwind CSS, Leaflet.js, OpenStreetMap / CartoDB tiles.
- **Routing Engine**: Client-side Weighted Multigraph Dijkstra Solver.
- **AI Integration**: Plug-and-play LLM endpoint (Ollama / OpenAI / Gemini).

---

*Built with ❤️ for Lagos commuters.*
