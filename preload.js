const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    downloadVideo: (url) => ipcRenderer.invoke('download-video', url),
    setTargetDirectory: () => ipcRenderer.invoke('set-target-dir'),
    setQuality: (quality) => ipcRenderer.invoke('set-quality', quality),
    setOutputFormat: (format) => ipcRenderer.invoke('set-output-format', format),
    fetchSettings: () => ipcRenderer.invoke('fetch-settings'),
    on: (channel, callback) => {
        ipcRenderer.on(channel, callback)
    }
})