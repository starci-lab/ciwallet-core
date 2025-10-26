import React, { useEffect, useState } from "react"
import { WalletIcon } from "@phosphor-icons/react"
import { motion } from "framer-motion"
import { NomasDivider, NomasLink } from "@/nomas/components"
import type { WithClassName } from "@ciwallet-sdk/types"
import { twMerge } from "tailwind-merge"

export enum Action {
  TwentyFivePercent = "25%",
  FiftyPercent = "50%",
  Max = "max",
}

export interface WalletProps extends WithClassName {
  isFocused?: boolean;
  disableFocus?: boolean;
  balance: number;
  onAction?: (action: Action) => void;
}

export const Wallet = ({
    isFocused,
    disableFocus,
    balance,
    onAction,
    className,
}: WalletProps) => {
    if (disableFocus) {
        return <BalanceWallet balance={balance} className={className} />
    }
    return (
        <WalletActions
            isFocused={isFocused}
            disableFocus={disableFocus}
            balance={balance}
            onAction={onAction}
            className={className}
        />
    )
}

export interface BalanceWalletProps extends WithClassName {
    balance: number
}

const BalanceWallet = ({ balance, className }: BalanceWalletProps) => {
    return (
        <div className={twMerge("flex items-center gap-1", className)}>
            <WalletIcon className={twMerge("w-4 h-4 text", className)} />
            <div className={twMerge("text-xs text", className)}>{balance}</div>
        </div>
    )
}

const WalletActions = ({
    isFocused,
    disableFocus,
    balance,
    onAction,
    className,
}: WalletProps) => {
    const [showCollapsed, setShowCollapsed] = useState(
        !isFocused || disableFocus
    )

    // Handle delayed collapse
    useEffect(() => {
        let timer: NodeJS.Timeout
        if (!isFocused && !disableFocus) {
            timer = setTimeout(() => setShowCollapsed(true), 500) // delay 0.5s
        } else {
            setShowCollapsed(false)
        }
        return () => clearTimeout(timer)
    }, [isFocused, disableFocus])

    return (
        <motion.div
            className={twMerge("flex items-center gap-1", className)}
            initial={false}
            animate={{ x: showCollapsed ? -10 : 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            {showCollapsed ? (
            // Collapsed state: show balance
                <BalanceWallet balance={balance} className={className} />
            ) : (
            // Expanded state: show only action buttons
                <motion.div
                    initial={false}
                    animate={{
                        opacity: 1,
                        x: 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex items-center gap-1 overflow-hidden"
                >
                    <NomasLink
                        underline={false}
                        onClick={() => onAction?.(Action.TwentyFivePercent)}
                    >
                        <div className="text-xs">25%</div>
                    </NomasLink>
                    <NomasDivider orientation="vertical" />
                    <NomasLink underline={false} onClick={() => onAction?.(Action.FiftyPercent)}>
                        <div className="text-xs">50%</div>
                    </NomasLink>
                    <NomasDivider orientation="vertical" />
                    <NomasLink underline={false} onClick={() => onAction?.(Action.Max)}>
                        <div className="text-xs">Max</div>
                    </NomasLink>
                </motion.div>
            )}
        </motion.div>
    )
}
