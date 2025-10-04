export class Encryption {
    private async deriveKey(secret: string): Promise<CryptoKey> {
        const enc = new TextEncoder()
        const keyBuffer = await crypto.subtle.digest("SHA-256", enc.encode(secret))
        return crypto.subtle.importKey(
            "raw",
            keyBuffer,
            { name: "AES-CBC" },
            false,
            ["encrypt", "decrypt"]
        )
    }
    /**
     * Encrypt a UTF-8 string using AES-CBC-256 and return base64(iv + ciphertext)
     */
    async encrypt(data: string, secret: string): Promise<string> {
        const key = await this.deriveKey(secret)
        const iv = crypto.getRandomValues(new Uint8Array(16))
        const encoder = new TextEncoder()

        const encryptedBuffer = await crypto.subtle.encrypt(
            { name: "AES-CBC", iv },
            key,
            encoder.encode(data)
        )

        const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength)
        combined.set(iv)
        combined.set(new Uint8Array(encryptedBuffer), iv.length)

        return this.arrayBufferToBase64(combined)
    }

    /**
     * Decrypt a base64(iv + ciphertext) back to UTF-8 string
     */
    async decrypt(ciphertext: string, secret: string): Promise<string> {
        const key = await this.deriveKey(secret)
        const combined = this.base64ToArrayBuffer(ciphertext)
        const iv = combined.slice(0, 16)
        const data = combined.slice(16)

        const decryptedBuffer = await crypto.subtle.decrypt(
            { name: "AES-CBC", iv: iv as Uint8Array },
            key,
            data
        )

        const decoder = new TextDecoder()
        return decoder.decode(decryptedBuffer)
    }

    private arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
        const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
        let binary = ""
        const chunkSize = 0x8000
        for (let i = 0; i < bytes.length; i += chunkSize) {
            binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
        }
        return btoa(binary)
    }

    private base64ToArrayBuffer(base64: string): ArrayBuffer {
        const binary = atob(base64)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i)
        }
        return bytes.buffer
    }
}