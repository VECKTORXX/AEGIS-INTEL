# AEGIS Intel — Military Cyber Intelligence Desktop App
### 100% Free Forever | No subscriptions | No credit card | No cloud

---

## Features
- Live CVE vulnerability feed (NIST NVD — free, no key)
- Global threat world map with animated attack arcs
- IP reputation scanner (AbuseIPDB — free tier)
- AI analyst chat powered by Ollama (runs 100% locally)
- Desktop push notifications for critical CVEs
- PDF report exporter (one click)
- Settings panel — all config in UI, no code editing
- CVE keyword watchlist — get alerted on your stack
- Sidebar navigation, auto-refresh, scan history

---

## Quick Start

### 1. Install Node.js
https://nodejs.org (LTS)

### 2. Install Ollama (free local AI — no account needed)
https://ollama.com  
Then in terminal:
```
ollama pull mistral
```

### 3. Run the app
```bash
cd aegis-intel
npm install
npm start
```

### 4. Build distributable
```bash
npm run build && npm run pack
# Output in dist/ as .exe / .dmg / .AppImage
```

---

## Where to enter your AbuseIPDB key
1. Click the ⚙ Settings button in the sidebar (bottom left)
2. Paste your key in the "AbuseIPDB API Key" field
3. Click SAVE CONFIG
4. Free signup (no credit card): https://www.abuseipdb.com

---

## Free AI Models
```
ollama pull mistral      # Best balance — recommended (4.1GB)
ollama pull llama3       # Meta LLaMA 3 (4.7GB)
ollama pull phi3         # Fastest / smallest (2.3GB)
ollama pull gemma2       # Google Gemma 2 (5.5GB)
```
Switch models inside Settings at any time.

---

## Project Structure
```
aegis-intel/
├── main.js
├── preload.js
├── package.json
├── public/index.html
└── src/
    ├── App.jsx                          # Main app + routing
    ├── index.css                        # Military dark theme
    ├── index.js
    ├── components/
    │   ├── TitleBar.jsx                 # Frameless window + clock
    │   ├── StatusBar.jsx                # Bottom live status
    │   ├── Sidebar.jsx                  # Navigation sidebar
    │   ├── CVEFeed.jsx                  # Live CVE feed
    │   ├── AIAnalyst.jsx                # Ollama AI chat
    │   ├── ThreatMetrics.jsx            # Stats + bar charts
    │   ├── panels/
    │   │   ├── IPScanner.jsx            # AbuseIPDB IP checker
    │   │   └── ThreatWorldMap.jsx       # Animated world map
    │   └── modals/
    │       └── SettingsModal.jsx        # Full config UI
    └── services/
        ├── cveService.js                # NIST NVD API
        ├── ollamaService.js             # Local AI
        ├── notificationService.js       # Desktop alerts
        └── reportService.js             # PDF export
```
