import { NomasCardBody } from "@/nomas/components/extends"
import { Button } from "@heroui/react"
import { Copy } from "phosphor-react"
import React from "react"
import { ChainId } from "@ciwallet-sdk/types"
import { chainManagerObj } from "@/nomas/obj"
import { QRCode } from "@/nomas/components/styled"
import { useAppSelector } from "@/nomas/redux"

interface DepositInfoProps {
    selectedChainId: ChainId
}

export const DepositInfo = ({ selectedChainId }: DepositInfoProps) => {
    const accounts = useAppSelector((state) => state.persits.session.accounts[selectedChainId])
    const selectedChain = chainManagerObj.getChainById(selectedChainId)
    const address = accounts?.accounts[0]?.accountAddress
    const handleCopy = () => {
        navigator.clipboard.writeText(address || "")
    }

    return (
        <NomasCardBody className="flex flex-col items-center gap-4">
            {/* QR + Network */}
            <div className="flex flex-col items-center gap-3">
                {/* Network name */}
                <div className="flex items-center gap-2">
                    <img src={selectedChain?.iconUrl} alt={selectedChain?.name || "Chain"} className="w-5 h-5" />
                    <span className="text-foreground-200 text-sm font-medium">
                        {selectedChain?.name || "Unknown Network"}
                    </span>
                </div>

                {/* QR Code */}
                <div className="bg-black rounded-xl p-2 shadow-inner size-fit">
                    <QRCode
                        data={address || ""}
                        size={192}
                    />
                </div>
            </div>

            {/* Address + Info */}
            <div className="flex flex-col items-center gap-2">
                <code className="text-foreground-300 text-sm break-all text-center">
                    {accounts?.accounts[0]?.accountAddress}
                </code>
                <p className="text-foreground-500 text-xs flex items-center gap-1">
                    <span>ℹ️</span> This address can only be used to receive compatible
          tokens
                </p>
            </div>

            {/* Copy Button */}
            <Button
                onPress={handleCopy}
                startContent={<Copy size={16} />}
                className="w-full bg-foreground-700 hover:bg-foreground-600 rounded-xl text-white font-medium"
            >
        Copy Address
            </Button>
        </NomasCardBody>
    )
}
