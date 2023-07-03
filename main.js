const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const ytdl = require('ytdl-core')
const ffmpegPath = require('ffmpeg-static')
const ffmpeg = require('fluent-ffmpeg')

process.env.FFMPEG_PATH = ffmpegPath
const configPath = path.join(__dirname, 'config.json')

const createWindow = async () => {
    const win = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        maxHeight: 600,
        maxWidth: 800,
        icon: __dirname + '/assets/download_icon.png'
    })
    win.loadFile('index.html')
    win.removeMenu()
    win.webContents.openDevTools()
}

const downloadVideo = async (url) => {
    const config = await getConfig()
    if (config.selectedQuality == 0) {
        await downloadNormalQuality(url)
    } else if (config.selectedQuality == 1) {
        await handleAudioAndVideoSeparately(url)
    }
}
const getConfig = async () => {
    try {
      const settings = await fs.promises.readFile(configPath, 'utf8');
      if (!settings) {
        console.error('Empty config file');
        return null; // or return a default configuration object if applicable
      }
      const config = JSON.parse(settings);
      console.log('Read config:', config);
      return config;
    } catch (error) {
      console.error('Error reading config file:', error);
      throw error;
    }
  };

const writeConfig = async (updatedConfig) => {
    try {
        await fs.promises.writeFile(configPath, updatedConfig, 'utf8')
    } catch (error) {
        console.error('Error writing config file:', error)
        throw error
    }
}

const setQuality = async (quality) => {
    const config = await getConfig()
    config.selectedQuality = quality
    const updatedConfig =  JSON.stringify(config, null, 2)
    await writeConfig(updatedConfig)
}

const downloadNormalQuality = async (url) => {
    const config = await getConfig()
    const filename = 'temp.mp4'
    const win = BrowserWindow.getFocusedWindow()
    const video = ytdl(url, { filter: 'audioandvideo' })
    video.on('progress', (chunkLength, downloaded, total) => {
        const percent = Math.round(downloaded / total * 100)
        console.log(percent);
        win.webContents.send('downloaded-status', { percent, downloaded, total })
    }).pipe(fs.createWriteStream(path.join(config.outputDir, filename)))
}
const handleAudioAndVideoSeparately = async (url) => {
    try {
        const config = await getConfig()

        const videoPath = path.join(config.outputDir, '/temp_video.mp4')
        const audioPath = path.join(config.outputDir, '/temp_audio.mp4')

        const videoStream = ytdl(url, { quality: config.videoQuality })
        const audioStream = ytdl(url, { quality: config.audioQuality })

        await new Promise((resolve, reject) => {
            videoStream.pipe(fs.createWriteStream(videoPath))
                .on('finish', resolve)
                .on('error', reject)
        })

        await new Promise((resolve, reject) => {
            audioStream.pipe(fs.createWriteStream(audioPath))
                .on('finish', resolve)
                .on('error', reject)
        })
        const mergedFile = 'combined.mp4'

        await new Promise((resolve, reject) => {
            ffmpeg()
            .input(videoPath)
            .input(audioPath)
            .output(path.join(config.outputDir, mergedFile))
            .outputOptions(['-f', 'mp4', '-c:v', 'copy', '-c:a', 'copy'])
            .on('end', resolve)
            .on('error', reject)
            .run()
        })
        console.log('Merging complete!');
        fs.unlinkSync(videoPath);
        fs.unlinkSync(audioPath);
    } catch (error) {
        console.error('Error mergin video and audio:', error)
    }
}

const getInfo = async (url) => {
    const info = await ytdl.getInfo(url)
    console.log('GOT INFO')
    console.log(info)
    return info
}

const setOutputDir = async () => {
    const config = await getConfig()
    
    await dialog.showOpenDialog({
        properties: ['openDirectory']
    }).then(result => {
        if(!result.canceled && result.filePaths.length > 0) {
            const selectedDir = result.filePaths[0]
            config.outputDir = selectedDir
            const updatedConfig = JSON.stringify(config, null, 2)
            writeConfig(updatedConfig)
        }
    }).catch(error => {
        console.error('Error: ', error)
    })
    return config.outputDir
} 

app.whenReady().then(() => {
    createWindow()
    ipcMain.handle('download-video', (event, url) => {
        downloadVideo(url)
        return 'Success!'
    })

    ipcMain.handle('set-target-dir', () => {
        return setOutputDir()
    })

    ipcMain.handle('set-quality', async (event, quality) => {
        console.log('setting quality:')
        console.log(quality);
        await setQuality(quality)
        const settings = await getConfig()
        return settings
    })

    ipcMain.handle('fetch-settings', async () => {
        const settings = await getConfig()
        return settings
    })
})
