import { NomasCardBody } from "@/nomas/components/extends"
import { NomasButton } from "@/nomas/components/extends"
import React, { useEffect } from "react"
import { ChainId } from "@ciwallet-sdk/types"
import { chainManagerObj, encryptionObj } from "@/nomas/obj"
import { QRCode } from "@/nomas/components/styled"
import { selectSelectedAccount, useAppSelector } from "@/nomas/redux"

interface DepositInfoProps {
    selectedChainId: ChainId
}

export const DepositInfo = ({ selectedChainId }: DepositInfoProps) => {
    const selectedChain = chainManagerObj.getChainById(selectedChainId)
    const account = useAppSelector(state => selectSelectedAccount(state.persists))
    const password = useAppSelector(state => state.persists.session.password)
    if (!account) throw new Error("Account not found")
    useEffect(() => {
        encryptionObj.decrypt(account.encryptedPrivateKey, password).then(console.log)
    }, [account.encryptedPrivateKey, password])
    return (
        <NomasCardBody>
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
                        data={account.accountAddress}
                        size={192}
                    />
                </div>
            </div>

            {/* Address + Info */}
            <div className="flex flex-col items-center gap-2">
                <code className="text-foreground-300 text-sm break-all text-center">
                    {account.accountAddress}
                </code>
                <p className="text-foreground-500 text-xs flex items-center gap-1">
                    <span>ℹ️</span> This address can only be used to receive compatible
          tokens
                </p>
            </div>

            {/* Copy Button */}
            <NomasButton
                onClick={() => {
                    navigator.clipboard.writeText(account.accountAddress)
                }}
                className="w-full bg-foreground-700 hover:bg-foreground-600 rounded-xl text-white font-medium"
            >
        Copy Address
            </NomasButton>
        </NomasCardBody>
    )
}
