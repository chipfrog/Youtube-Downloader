let settingsOn = false

window.electronAPI.on('downloaded-status', (event, data) => {
    const downloadedMegabytes = (data.downloaded/1000000).toFixed(2).toString()
    const totalMegabytes = (data.total/1000000).toFixed(2).toString()
    document.getElementById('downloadbar').style.width = data.percent.toString() + "%"

    if (downloadedMegabytes == totalMegabytes) {
        document.getElementById('download-progress-text').innerHTML = 'Complete!'
    } else {
        document.getElementById('download-progress-text').innerHTML = downloadedMegabytes + ' / ' + totalMegabytes + ' MB'
    }
})

document.getElementById('download-btn').addEventListener('click', async () => {
    let formData = new FormData(document.getElementById('downloadForm'))
    let url = formData.get('url')
    const response = await window.electronAPI.downloadVideo(url)
    if (response) {
        document.getElementById('downloadbar-container').style.display = 'block'
    }
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
    if (response.outputFormat == 'video') {
        document.getElementById("output-both").checked = true
    } else if (response.outputFormat == 'audio') {
        document.getElementById("output-audio").checked = true
        qualitySettingsDisabled(true)
    }
    console.log('Fetched settings:');
    console.log(response.outputFormat);
})

document.getElementById("output-both").addEventListener((event, 'change'), async (event) => checkSelection(event))
document.getElementById("output-audio").addEventListener('change', async (event) => checkSelection(event))

async function checkSelection(event) {
    let selectedOption = event.target.value
    let response
    
    if (selectedOption == 'audio') {
        qualitySettingsDisabled(true)
        response = await window.electronAPI.setOutputFormat('audio')
        console.log(response);
        
    }
    else if (selectedOption == 'both') {
        qualitySettingsDisabled(false)
        response = await window.electronAPI.setOutputFormat('video')
        console.log(response);
    }
}

function qualitySettingsDisabled(status) {
    document.getElementById('high-quality').disabled = status
    document.getElementById('normal-quality').disabled = status
}



