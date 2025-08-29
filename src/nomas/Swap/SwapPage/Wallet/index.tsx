import React from "react"
import { WalletIcon } from "@phosphor-icons/react"
import { motion } from "framer-motion"
import { NomasDivider, NomasLink } from "@/nomas/components"

export enum Action {
    TwentyFivePercent = "25%",
    FiftyPercent = "50%",
    Max = "max",
}
export interface WalletProps {
    isTouched: boolean
    disableTouch?: boolean
    balance: number
    onAction: (action: Action) => void
}
export const Wallet = ({ isTouched, disableTouch, balance, onAction }: WalletProps) => {
    if (!isTouched || disableTouch) {
        return (
            <div className="flex items-center gap-1">
                <WalletIcon className="w-4 h-4"/>
                <div className="text-xs">
                    {balance}
                </div>
            </div>
        )
    }
    return (
        <motion.div
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <div className="flex gap-1 h-4">
                <NomasLink asButton onPress={() => onAction(Action.TwentyFivePercent)}>
                    <div className="text-xs">
                    25%
                    </div>
                </NomasLink>
                <NomasDivider />
                <NomasLink asButton onPress={() => onAction(Action.FiftyPercent)}>
                    <div className="text-xs">
                    50%
                    </div>
                </NomasLink>
                <NomasDivider />
                <NomasLink asButton onPress={() => onAction(Action.Max)}>
                    <div className="text-xs">
                    Max
                    </div>
                </NomasLink>
            </div>
        </motion.div>
    )
}