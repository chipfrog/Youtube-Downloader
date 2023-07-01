let settingsOn = false

document.getElementById('download-btn').addEventListener('click', async () => {
    let formData = new FormData(document.getElementById('downloadForm'))
    let url = formData.get('url')
    const response = await window.electronAPI.downloadVideo(url)
})

document.getElementById('target-btn').addEventListener('click', async () => {
    const response = await window.electronAPI.setTargetDirectory()
    document.getElementById('chosen-directory').value = response
})

document.getElementById('settings-btn').addEventListener('click', () => {
    document.getElementById('sidepanel').style.width = "250px"
    document.getElementById('close-btn').style.left = "200px"
    document.getElementById('navbar').style.backgroundColor = "#c90202"  
})

document.getElementById('close-btn').addEventListener('click', () => {
    document.getElementById('sidepanel').style.width = "0"
    document.getElementById('navbar').style.backgroundColor = "#FF0000"    
})

document.getElementById('high-quality').addEventListener('click', async () => {
    const response = await window.electronAPI.setQuality(1)
    console.log(response);
})

document.getElementById('normal-quality').addEventListener('click', async () => {
    const response = await window.electronAPI.setQuality(0)
    console.log(response)
})

document.addEventListener('DOMContentLoaded', async () => {
    const response = await window.electronAPI.fetchSettings()
    document.getElementById('chosen-directory').value = response.outputDir
    if (response.selectedQuality == 0) {
        document.getElementById('normal-quality').checked = true
    } else if (response.selectedQuality == 1) {
        document.getElementById('high-quality').checked = true
    }
    console.log('Fetched settings:');
    console.log(response);
})




