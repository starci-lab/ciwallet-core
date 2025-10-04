import React from "react"
import { useAppSelector } from "@/nomas/redux"
import { Function } from "@/nomas/redux"
import { DepositFunction } from "./DepositFunction"
export const MainSection = () => {
    const currentFunction = useAppSelector((state) => state.stateless.function.function)
    const renderContent = () => {
        switch (currentFunction) {
        case Function.Deposit: {
            return <DepositFunction />
        }
        default:
            throw new Error(`Unknown function: ${currentFunction}`)
        }
    }
    return <>{renderContent()}</>
}