let settingsOn = false

document.getElementById('download-btn').addEventListener('click', async () => {
    let formData = new FormData(document.getElementById('downloadForm'))
    let url = formData.get('url')
    const response = await window.electronAPI.downloadVideo(url)
    console.log(response)
})

document.getElementById('target-btn').addEventListener('click', async () => {
    const response = await window.electronAPI.setTargetDirectory()
    console.log(response)
    document.getElementById('chosen-directory').value = response
})

document.getElementById('settings-btn').addEventListener('click', () => {
    if (settingsOn) {
        document.getElementById('sidepanel').style.width = "0"
    } else {
        document.getElementById('sidepanel').style.width = "250px"
    }
    settingsOn = !settingsOn
})

document.getElementById('close-btn').addEventListener('click', () => {
    if (settingsOn) {
        document.getElementById('sidepanel').style.width = "0"
        settingsOn = false
    }
})

document.addEventListener('DOMContentLoaded', async () => {
    const response = await window.electronAPI.fetchSettings()
    document.getElementById('chosen-directory').value = response.outputDir
    
})




