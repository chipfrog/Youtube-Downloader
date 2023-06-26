const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const ytdl = require('ytdl-core')

const createWindow = () => {
    const win = new BrowserWindow({
        // Kokeile muuttaa preload.js pathia ja katso toimiiko
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        maxHeight: 600,
        maxWidth: 800
    })

    win.loadFile('index.html')
    win.removeMenu()
    win.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()
    ipcMain.handle('get-video', (event, url) => {
        console.log(url)
        return `We got url: ${url}!`
    })
})
