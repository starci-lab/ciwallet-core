import { NomasCard, NomasCardBody, NomasCardHeader } from "@/nomas/components/extends"
import { SelectChainTab } from "@/nomas/components/styled"
import { useAppSelector } from "@/nomas/redux"
import React, { useState } from "react"
import { DepositInfo } from "./DepositInfo"
import { ChainId } from "@ciwallet-sdk/types"

export const DepositSection = () => {
    const chainManager = useAppSelector((state) => state.chain.manager)
    const [selectedChainId, setSelectedChainId] = useState<ChainId>(ChainId.Monad)
    
    //TODO: Remove the mt-4 later
    return (
        <NomasCard asCore className="max-w-md mx-auto mt-4">
            <NomasCardHeader
                title="Deposit"
                showBackButton
                onBackButtonPress={() => {}}
            />
            <NomasCardBody>
                <SelectChainTab
                    chainManager={chainManager}
                    isSelected={(chainId) => selectedChainId === chainId}
                    onSelect={(chainId) => {
                        setSelectedChainId(chainId)
                    }}
                />
            </NomasCardBody>
            <NomasCardBody>
                <DepositInfo selectedChainId={selectedChainId} />
            </NomasCardBody>
        </NomasCard>
    )
}