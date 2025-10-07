import React from "react"
import { useAppSelector } from "@/nomas/redux"
import { Function } from "@/nomas/redux"
import { DepositFunction } from "./DepositFunction"
import { WithdrawFunction } from "./WithdrawFunction"
export const MainSection = () => {
    const currentFunction = useAppSelector((state) => state.stateless.function.function)
    const renderContent = () => {
        switch (currentFunction) {
        case Function.Deposit: {
            return <DepositFunction />
        }
        case Function.Withdraw: {
            return <WithdrawFunction />
        }
        default:
            throw new Error(`Unknown function: ${currentFunction}`)
        }
    }
    return <>{renderContent()}</>
}