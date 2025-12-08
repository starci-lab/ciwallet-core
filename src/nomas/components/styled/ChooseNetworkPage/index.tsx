import React, { useMemo } from "react"
import { ChainId, type ChainIdWithAllNetwork } from "@ciwallet-sdk/types"
import { NomasCardHeader, NomasCardBody, NomasCardVariant, NomasInput, NomasCard, NomasSpacer } from "../../extends"
import { chainManagerObj } from "@/nomas/obj"
import { NomasImage } from "../../extends"
import { AlphabetList } from "../../reusable"
import { selectSelectedAccounts, useAppSelector } from "@/nomas/redux"
import { chainIdToPlatform, shortenAddress } from "@ciwallet-sdk/utils"
import { CheckCircleIcon, GlobeIcon } from "@phosphor-icons/react"
import { PressableMotion } from "../PressableMotion"
import { twMerge } from "tailwind-merge"

export interface ChooseNetworkPageProps {
    withAllNetworks?: boolean
    isSelected: (chainId: ChainIdWithAllNetwork) => boolean
    showBackButton?: boolean
    onBackButtonPress?: () => void
    endContent?: (chainId: ChainIdWithAllNetwork) => React.ReactNode
    isPressable?: boolean
    onPress?: (chainId: ChainIdWithAllNetwork) => void
    onSearchQueryChange?: (query: string) => void
    searchQuery?: string
}

export const ChooseNetworkPage = ({ 
    withAllNetworks = false, 
    isSelected, 
    showBackButton, 
    onBackButtonPress,
    onPress,
    onSearchQueryChange,
    searchQuery
}: ChooseNetworkPageProps) => {  
    const chainMetadatas = useMemo(() => {
        return chainManagerObj.toObject()
    }, [])
    const selectedAccounts = useAppSelector((state) => selectSelectedAccounts(state.persists))
    return (
        <>
            <NomasCardHeader
                title="Choose Network"
                showBackButton={showBackButton}
                onBackButtonPress={onBackButtonPress}
            />
            <NomasCardBody>
                <NomasInput
                    placeholder="Search network by name or id"
                    onValueChange={(value) => {
                        onSearchQueryChange?.(value)
                    }}
                    value={searchQuery}
                />
                <NomasSpacer y={4}/>
                <NomasCard variant={NomasCardVariant.Dark} isInner className="p-4" >
                    <NomasCardBody scrollable className="p-0 flex flex-col gap-2">
                        { 
                            withAllNetworks && !searchQuery && (
                                <>
                                    <PressableMotion onClick={() => {
                                        onPress?.("all-network")
                                    }} className={
                                        twMerge("py-1 flex items-center gap-2 justify-between rounded-button")
                                    }>
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <GlobeIcon className="w-10 h-10"/>
                                                    <div>
                                                        <div className="text-sm text-text">All Networks</div> 
                                                        <div className="text-xs text-muted">{chainManagerObj.toObject().length} chains</div> 
                                                    </div>
                                                </div>
                                            </div>    
                                            {
                                                isSelected("all-network") && (
                                                    <CheckCircleIcon className="w-5 h-5" weight="fill"/>
                                                )
                                            }
                                        </div>
                                    </PressableMotion>
                                    <NomasSpacer y={6}/>
                                </>
                            )
                        }
                        <AlphabetList
                            filterValue={searchQuery ?? ""}
                            popularItems={[
                                {
                                    letter: "B",
                                    item: chainMetadatas.find((chainMetadata) => chainMetadata.id === ChainId.Bitcoin),
                                    key: ChainId.Bitcoin
                                },
                                {
                                    letter: "E",
                                    item: chainMetadatas.find((chainMetadata) => chainMetadata.id === ChainId.Ethereum),
                                    key: ChainId.Ethereum
                                },
                                {
                                    letter: "S",
                                    item: chainMetadatas.find((chainMetadata) => chainMetadata.id === ChainId.Solana),
                                    key: ChainId.Solana
                                },
                                {
                                    letter: "S",
                                    item: chainMetadatas.find((chainMetadata) => chainMetadata.id === ChainId.Sui),
                                    key: ChainId.Sui
                                }
                            ]}
                            popularTitle="Popular Networks"
                            items={
                                Object.entries(chainMetadatas).map(([_, chainMetadata]) => (
                                    { 
                                        letter: chainMetadata.id.charAt(0).toUpperCase(), 
                                        item: chainMetadata, 
                                        key: chainMetadata.id 
                                    }
                                )
                                )
                            }
                            renderItem={({ item }) => {
                                const platform = chainIdToPlatform(item?.id ?? ChainId.Ethereum)
                                return (
                                    <PressableMotion onClick={() => {
                                        onPress?.(item?.id ?? ChainId.Ethereum)
                                    }} className="flex items-center justify-between py-1">
                                        <div className="flex items-center gap-2">
                                            <NomasImage src={item?.iconUrl ?? ""} className="w-10 h-10 rounded-full" />
                                            <div>
                                                <div className="text-sm font-medium">{item?.name ?? ""}</div>
                                                <div className="text-xs text-muted">{shortenAddress(selectedAccounts[platform]?.accountAddress ?? "")}</div>
                                            </div>  
                                        </div>
                                        {
                                            isSelected(item?.id ?? ChainId.Ethereum) && (
                                                <CheckCircleIcon className="w-5 h-5" weight="fill"/>
                                            )
                                        }
                                    </PressableMotion>)}
                            }
                            onFilter={(item) => {
                                return (item?.name?.toLowerCase().includes(searchQuery?.toLowerCase() ?? "") ?? false)
                                || (item?.id?.toLowerCase().includes(searchQuery?.toLowerCase() ?? "") ?? false)
                            }}
                        />
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
        </>
    )
}