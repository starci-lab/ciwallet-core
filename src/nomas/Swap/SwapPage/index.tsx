import React from "react"
import { NomasCard, NomasCardBody, NomasCardHeader } from "../../components"
import { WalletIcon } from "@phosphor-icons/react"
import { Spacer } from "@heroui/react"
import { SelectToken } from "./SelectToken"
import { setSwapPage, SwapPageState, useAppDispatch, useAppSelector } from "../../redux"

export const SwapPage = () => {
    const tokenManager = useAppSelector(state => state.token.manager)
    const dispatch = useAppDispatch()
    return (
        <>
            <NomasCardHeader title="Swap" showBackButton onBackButtonPress={() => {
                dispatch(setSwapPage(SwapPageState.SelectToken))
            }} />
            <NomasCardBody>
                <NomasCard className="bg-content3">
                    <NomasCardBody>
                        <div className="flex items-center gap-2 justify-between">
                            <div className="text-sm">
                            You Pay
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <WalletIcon/>
                                123
                            </div>
                        </div>
                        <Spacer y={1.5}/>  
                        <NomasCard className="bg-content2">
                            <NomasCardBody className="flex-row flex justify-between items-center gap-">
                                <SelectToken token={tokenManager.toObject().monad!.mainnet!.at(0)!} onSelect={() => {
                                    dispatch(setSwapPage(SwapPageState.SelectToken))
                                }} />
                                <div>
                                    <div className="text-lg">
                                        555
                                    </div>
                                    <div className="text-xs">
                                        $1500
                                    </div>
                                </div>
                            </NomasCardBody>
                        </NomasCard>
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
        </>
    )
}