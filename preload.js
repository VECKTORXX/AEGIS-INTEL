const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('aegis', {
  fetchCVEs:      ()            => ipcRenderer.invoke('fetch-cves'),
  fetchAbuseIPs:  (key)         => ipcRenderer.invoke('fetch-abuse-ips', key),
  askOllama:      (opts)        => ipcRenderer.invoke('ask-ollama', opts),
  notify:         (opts)        => ipcRenderer.send('notify', opts),
  minimizeWindow: ()            => ipcRenderer.send('window-minimize'),
  maximizeWindow: ()            => ipcRenderer.send('window-maximize'),
  closeWindow:    ()            => ipcRenderer.send('window-close'),
});
