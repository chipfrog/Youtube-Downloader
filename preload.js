const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    downloadVideo: (url) => ipcRenderer.invoke('get-video', url)
})