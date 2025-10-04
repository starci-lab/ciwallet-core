import QRCodeStyling from "qr-code-styling"
import React, { useEffect, useRef } from "react"

export interface QRCodeProps {
    // data to be encoded
    data?: string
    // icon url to be displayed in the center of the QR code
    iconUrl?: string
    // color of the QR code
    color?: string
    // size of the QR code
    size?: number
    // background color
    backgroundColor?: string
}
  
export const QRCode = ({ 
    data = "https://qr-code-styling.com", 
    iconUrl = "https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-1/534136898_749293854666581_1584213272352607870_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=107&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeFqh_r3g1VaKKx2wFccqASXzBUDs9FLWU_MFQOz0UtZT0Pflcmod5znN1RtZH6geE4rZxAs1W7G0U1ZjE0oRwUb&_nc_ohc=Dd6wn9fXs7IQ7kNvwG8QGU1&_nc_oc=Adk_Vvc9Z_j6VqzoCTgZuUvL25KbC-mfyA06wDNhE69bIv-yPtmp41-rbfnuLIXfsFk&_nc_zt=24&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=xs9m6JedG9pqPWVXW5urIA&oh=00_AfaqlL9sZStxG_zIHJrr-zGlzhaSNP9-PWh47rRcNnwaug&oe=68E110A7", 
    color = "#FFA9D1", 
    size = 300,
    backgroundColor = "#FFFFFF"
}: QRCodeProps) => {
    const qrCodeStylingRef = useRef<QRCodeStyling>(null)
    const qrCodeRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!qrCodeRef.current) return
        qrCodeStylingRef.current = new QRCodeStyling({
            width: size,
            height: size,
            image: iconUrl,
            dotsOptions: {
                color,
                type: "rounded"
            },
            cornersSquareOptions: {
                color,
                type: "extra-rounded"
            },
            cornersDotOptions: {
                color,
                type: "extra-rounded"
            },
            backgroundOptions: {
                color: backgroundColor,
                round: 14,
            },
            imageOptions: {
                hideBackgroundDots: true,
                imageSize: 0.5,
                margin: 10,
                crossOrigin: "anonymous",
            }
        })
        qrCodeStylingRef.current.append(qrCodeRef.current)
        return () => {
            if (!qrCodeRef.current) return
            qrCodeRef.current.innerHTML = ""
        }
    }, [])

    useEffect(() => {
        if (!qrCodeStylingRef.current) {
            return
        }
        qrCodeStylingRef.current.update({
            data,
        })
    }, [ data ])
    
    return (
        <div className="shadow rounded-lg">
            <div style={{
                width: size,
                height: size,
            }} ref={qrCodeRef} />
        </div>
    )
}
