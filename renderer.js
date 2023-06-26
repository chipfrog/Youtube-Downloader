
    document.getElementById('download-btn').addEventListener('click', async () => {
        let formData = new FormData(document.getElementById('downloadForm'))
        let url = formData.get('url')
        const response = await window.electronAPI.downloadVideo(url)
        console.log(response)
    })

    document.getElementById('target-btn').addEventListener('click', async () => {
        // let formData = new FormData(document.getElementById('downloadForm'))
        const response = await window.electronAPI.setTargetDirectory()
        console.log(response)
    })


