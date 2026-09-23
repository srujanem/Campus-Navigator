# 🏛️ Campus Navigation Agent
### Autonomous Indoor Navigation with Multimodal Agentic AI

An intelligent, multi-tenant indoor campus navigation system powered by **Agentic AI**, graph algorithms (**A\***), and multimodal inputs (Voice, Vision, Floor Plans).

Built for universities, hospitals, and large indoor venues where GPS is unavailable.

---

## 🌟 Key Features

1. **Dual Route Calculation & AI Shortest Path Recommendation**
   - Automatically computes multiple walkable routes (e.g., Direct via Lift vs Alternative via Stairs).
   - Recommends the shortest route, displaying exact distance and time savings in real-time.
   - Interactive selection allows users to compare and switch routes on the interactive blueprint.

2. **Architectural Blueprint Map & First-Person HUD**
   - SVG blueprint map showing rooms, labs, stairs, lifts, washrooms, and fire extinguishers.
   - Dual-view interface: **Map View** (blueprint with animated route and walking indicator) + **HUD View** (turn-by-turn guidance with step-by-step progress).

3. **AR Live View (Simulated Visual SLAM)**
   - Overlays directional AR arrows directly onto your device's camera feed.
   - Real-time technical HUD simulating 30 FPS feature tracking and VLM pose estimation.

4. **Agentic Voice AI & Multilingual TTS**
   - Speech-to-Text natural voice input via Web Speech API.
   - Text-to-Speech (TTS) turn guidance in **English, Hindi, Tamil, and Telugu**.

5. **Explainable AI: Agent Reasoning Log**
   - Live terminal panel revealing internal agent steps: `[PARSE]`, `[RESOLVE]`, `[A* GRAPH]`, `[REROUTE]`.
   - Real-time recalculation when obstacles or blocked staircases are detected.

6. **Proactive Schedule-Aware Alerts**
   - Autonomous notifications recommending when to leave based on class schedule and walking distance.

7. **Multi-Tenant Admin Portal (`/admin`)**
   - 5-step wizard for institutions to digitize their campus:
     - College setup & floor count configuration.
     - Blueprint upload with automated room extraction simulation.
     - Interactive node and room coordinate manager.
     - Timetable CSV parser for class-to-room mapping.
     - Exportable unified campus spatial configuration JSON.

---

## 🏗️ Architecture

```
campus-navigation-agent/
├── backend/
│   ├── api/routes.py            # FastAPI routing endpoints
│   ├── core/
│   │   ├── agent.py             # NLP destination resolution
│   │   ├── graph_engine.py      # NetworkX A* routing & dual path engine
│   │   └── vision_pipeline.py   # VLM localization pipeline
│   ├── data/graph.json          # Spatial graph (nodes, edges, floors)
│   ├── main.py                  # Server entry point
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FloorPlanMap.tsx # SVG blueprint map with dual routes
│   │   │   ├── NavigationHUD.tsx# First-person turn HUD
│   │   │   ├── ARLiveView.tsx   # AR camera overlay
│   │   │   ├── VoiceSearch.tsx  # Speech input & TTS engine
│   │   │   ├── AgentThinkingLog.tsx # Agent reasoning terminal
│   │   │   └── ProactiveAlert.tsx   # Timetable departure alerts
│   │   ├── pages/
│   │   │   ├── NavigationPage.tsx   # Main student navigation
│   │   │   ├── AdminPage.tsx        # Multi-tenant admin wizard
│   │   │   └── VisionDemoPage.tsx   # Photo upload localization demo
│   │   ├── services/api.ts      # Backend REST client
│   │   └── App.tsx
│   └── package.json
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

### 2. Backend Setup
```bash
cd backend
python -m venv venv

# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python main.py
```
*Backend runs on `http://localhost:8000`*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 💻 Tech Stack
- **Frontend:** React, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend:** FastAPI, Uvicorn, NetworkX, Pydantic, Python
- **Algorithms:** A* Shortest Path, Topological Multi-Route Extraction, Web Speech API
