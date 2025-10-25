const createResizedCursor = (
    imageUrl: string,
    size: number = 32,
    callback: (dataUrl: string) => void,
    extractFrame?: { frameWidth: number; frameIndex: number } // Extract single frame from sprite sheet
) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        canvas.width = size
        canvas.height = size

        if (ctx) {
            if (extractFrame) {
                // Extract a single frame from sprite sheet
                const { frameWidth, frameIndex } = extractFrame
                const sourceX = frameWidth * frameIndex
                const sourceY = 0
                const sourceWidth = frameWidth
                const sourceHeight = img.height

                // Draw only the specified frame
                ctx.drawImage(
                    img,
                    sourceX,
                    sourceY,
                    sourceWidth,
                    sourceHeight, // Source rectangle
                    0,
                    0,
                    size,
                    size // Destination rectangle
                )
            } else {
                // Resize entire image
                ctx.drawImage(img, 0, 0, size, size)
            }
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
