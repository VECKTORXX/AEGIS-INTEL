const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const axios = require('axios');

const isDev = process.env.NODE_ENV !== 'production';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#0a0e14',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'public', 'icon.png')
  });

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, 'build/index.html')}`);

  if (isDev) mainWindow.webContents.openDevTools({ mode: 'detach' });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });

// ── IPC: Window controls ──────────────────────────────────────────────────────
ipcMain.on('window-minimize', () => mainWindow.minimize());
ipcMain.on('window-maximize', () => mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize());
ipcMain.on('window-close',    () => mainWindow.close());

// ── IPC: Fetch CVE feed from NIST NVD (free, no key) ─────────────────────────
ipcMain.handle('fetch-cves', async () => {
  try {
    const res = await axios.get('https://services.nvd.nist.gov/rest/json/cves/2.0', {
      params: { resultsPerPage: 20, startIndex: 0 },
      timeout: 10000
    });
    return res.data.vulnerabilities.map(v => ({
      id: v.cve.id,
      description: v.cve.descriptions.find(d => d.lang === 'en')?.value || 'No description',
      severity: v.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity
               || v.cve.metrics?.cvssMetricV2?.[0]?.baseSeverity
               || 'UNKNOWN',
      score: v.cve.metrics?.cvssMetricV31?.[0]?.cvssData?.baseScore
            || v.cve.metrics?.cvssMetricV2?.[0]?.cvssData?.baseScore
            || 0,
      published: v.cve.published,
      references: v.cve.references?.slice(0, 2).map(r => r.url) || []
    }));
  } catch (e) {
    return { error: e.message };
  }
});

// ── IPC: Fetch AbuseIPDB blacklist (free, 1000/day) ───────────────────────────
ipcMain.handle('fetch-abuse-ips', async (_, apiKey) => {
  if (!apiKey) return { error: 'No API key provided' };
  try {
    const res = await axios.get('https://api.abuseipdb.com/api/v2/blacklist', {
      headers: { Key: apiKey, Accept: 'application/json' },
      params: { confidenceMinimum: 90, limit: 50 },
      timeout: 10000
    });
    return res.data.data;
  } catch (e) {
    return { error: e.message };
  }
});

// ── IPC: Query local Ollama AI (free forever, runs on your machine) ───────────
ipcMain.handle('ask-ollama', async (_, { prompt, model, ollamaUrl }) => {
  const base = (ollamaUrl || 'http://localhost:11434').replace(/\/$/, '');
  try {
    const res = await axios.post(`${base}/api/generate`, {
      model: model || 'mistral',
      prompt,
      stream: false
    }, { timeout: 60000 });
    return { response: res.data.response };
  } catch (e) {
    return { error: 'Ollama not running. Install from ollama.com and run: ollama pull mistral' };
  }
});

// ── IPC: Desktop notification ─────────────────────────────────────────────────
ipcMain.on('notify', (_, { title, body }) => {
  if (Notification.isSupported()) {
    new Notification({ title, body, urgency: 'critical' }).show();
  }
});
