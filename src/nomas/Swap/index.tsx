import React from "react"
import { NomasCard, NomasCardBody, NomasCardHeader } from "../components"
import { useAppSelector } from "../redux"
import { SelectToken } from "./SelectToken"
import { useSelectTokenDisclosure } from "../hooks"
export const Swap = () => {
    const tokenManager = useAppSelector(state => state.token.manager)
    const { onOpen} = useSelectTokenDisclosure()
    return (
        <NomasCard>
            <NomasCardHeader>
                Swap
            </NomasCardHeader>
            <NomasCardBody>  
                <SelectToken token={tokenManager.toObject().monad?.mainnet?.at(0)} onSelect={() => {
                    onOpen()
                }} />
            </NomasCardBody>
        </NomasCard>
    )
}