import React from "react"
import { QRCodeCanvas } from "qrcode.react"

interface QRCodeProps {
  data: string
  size?: number
}

export const QRCode: React.FC<QRCodeProps> = ({ data, size = 200 }) => {
    return (
        <div
            className="flex items-center justify-center rounded-2xl overflow-hidden bg-white p-4 shadow-md"
            style={{ width: size, height: size }}
        >
            <QRCodeCanvas
                value={data}
                size={size - 16} // account for padding
                includeMargin={false}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
            />
        </div>
    )
}