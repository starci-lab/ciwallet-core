import React, { useMemo } from "react"
import { AlphabetList, NomasCard, NomasCardBody, NomasCardHeader, NomasCardVariant, NomasImage, NomasInput, NomasSpacer, Snippet } from "@/nomas/components"
import { Scene, selectSelectedAccounts, setScene, setFilterValue, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import { chainManagerObj } from "@/nomas/obj"
import { chainIdToPlatform, shortenAddress } from "@ciwallet-sdk/utils"
import { ChainId } from "@ciwallet-sdk/types"

export const CopyAddressScene = () => {
    const dispatch = useAppDispatch()
    const filterValue = useAppSelector((state) => state.stateless.sections.copyAddress.filterValue)
    const chainMetadatas = useMemo(() => {
        return chainManagerObj.toObject()
    }, [])
    const selectedAccounts = useAppSelector((state) => selectSelectedAccounts(state.persists))
    return (
        <NomasCard variant={NomasCardVariant.Gradient}
            isContainer
            className="w-full">
            <NomasCardHeader title="Copy Address" showBackButton onBackButtonPress={() => {
                dispatch(setScene(Scene.Main))
            }} />
            <NomasCardBody>
                <NomasInput prefixIcon={<MagnifyingGlassIcon />} value={filterValue} onValueChange={(value) => dispatch(setFilterValue(value))} />
                <NomasSpacer y={4} />
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <NomasCardBody scrollable scrollHeight={300} className="p-4">
                        <AlphabetList
                            filterValue={filterValue}
                            popularItems={[
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
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <NomasImage src={item?.iconUrl ?? ""} className="w-10 h-10 rounded-full" />
                                            <div>
                                                <div className="text-sm font-medium">{item?.name ?? ""}</div>
                                                <div className="text-xs text-muted">{shortenAddress(selectedAccounts[platform]?.accountAddress ?? "")}</div>
                                            </div>
                                        </div>
                                        <Snippet
                                            copyString={selectedAccounts[platform]?.accountAddress ?? ""}
                                            className="text-muted"
                                        />
                                    </div>)}
                            }
                            onFilter={(item) => {
                                return (item?.name?.toLowerCase().includes(filterValue.toLowerCase()) ?? false)
                                || (item?.id?.toLowerCase().includes(filterValue.toLowerCase()) ?? false)
                            }}
                        />
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
        </NomasCard>
    )
}