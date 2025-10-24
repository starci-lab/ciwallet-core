const createResizedCursor = (
    imageUrl: string,
    size: number = 32,
    callback: (dataUrl: string) => void
) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        canvas.width = size
        canvas.height = size

        if (ctx) {
            ctx.drawImage(img, 0, 0, size, size)
            const dataUrl = canvas.toDataURL("image/png")
            callback(dataUrl)
        }
    }
    img.onerror = () => {
        console.error("Failed to load cursor image:", imageUrl)
        callback(imageUrl)
    }
    img.src = imageUrl
}

export default createResizedCursor