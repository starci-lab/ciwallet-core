import React, { useMemo } from "react"
import { NomasButton, NomasCard, NomasCardBody, NomasCardFooter, NomasCardHeader, NomasCardVariant, NomasInput } from "../../../extends"
import { SettingsPage, setSettingsPage, updateRpc, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { chainManagerObj } from "@/nomas/obj"
import { Network } from "@ciwallet-sdk/types"

export const RPCDetailsScene = () => {
    const dispatch = useAppDispatch()
    const rpcChainId = useAppSelector((state) => state.stateless.sections.settings.rpcChainId)
    const chain = useMemo(() => chainManagerObj.getChainById(rpcChainId), [rpcChainId])
    const rpcs = useAppSelector((state) => state.persists.session.rpcs)
    const network = useAppSelector((state) => state.persists.session.network)
    const renderRpcs = useMemo(() => {
        return rpcs[rpcChainId]?.[network] || []
    }, [rpcs, rpcChainId, network])
    return (
        <NomasCard variant={NomasCardVariant.Gradient} isContainer className="w-full">
            <NomasCardHeader 
                title={chain?.name + (network === Network.Mainnet ? " (Mainnet)" : " (Testnet)")} 
                showBackButton
                description={"Nomas allows you to configure multiple RPC endpoints for each chain. RPCs are used from top to bottom, prioritized by speed, reliability, and health."}
                onBackButtonPress={() => {
                    dispatch(setSettingsPage(SettingsPage.RPC))
                }} 
            />
            <NomasCardBody>
                <div className="p-0 flex flex-col gap-4">
                    {
                        Object.values(renderRpcs).map((rpc, index) => {
                            return (
                                <NomasInput 
                                    key={rpc}
                                    value={rpc}
                                    onValueChange={(value) => {
                                        dispatch(updateRpc({
                                            chainId: rpcChainId,
                                            network,
                                            index,
                                            rpc: value,
                                        }))
                                    }}
                                />
                            )
                        })
                    }
                </div>
            </NomasCardBody>
            <NomasCardFooter>
                <NomasButton xlSize className="w-full">
                    Save
                </NomasButton>
            </NomasCardFooter>
        </NomasCard>
    )
}