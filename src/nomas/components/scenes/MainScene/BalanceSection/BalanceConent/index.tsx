import React, { useMemo } from "react"
import { NomasLink } from "@/nomas/components"
import { CaretUpIcon, EyeClosedIcon, EyeIcon } from "@phosphor-icons/react"
import { twMerge } from "tailwind-merge"
import { setVisible, useAppDispatch, useAppSelector, selectTokens } from "@/nomas/redux"

export const BalanceContent = () => {
    const visible = useAppSelector((state) => state.stateless.sections.home.visible)
    const balances = useAppSelector((state) => state.stateless.dynamic.balances)
    const tokens = useAppSelector((state) => selectTokens(state.persists))
    const prices = useAppSelector((state) => state.stateless.dynamic.prices)
    const { totalBalance, whole, cents } = useMemo(
        () =>{
            const totalBalance = tokens.reduce(
                (acc, token) => 
                    acc + (balances[token.tokenId] ?? 0) * (prices[token.tokenId] ?? 0), 0)
            const s = totalBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
            })
            const [whole, cents] = s.split(".")
            return { totalBalance, whole: whole ?? "0", cents: cents ?? "00" }
        },
        [tokens, balances, prices]
    )
    const dispatch = useAppDispatch()
    const isPositive = totalBalance >= 0
    return (
        <div className="flex flex-col items-center justify-center py-8 px-4 gap-4">
            <div className="flex items-center gap-2">
                <NomasLink onClick={() => dispatch(setVisible(!visible))}>
                    {visible ? <EyeIcon /> : <EyeClosedIcon />}
                </NomasLink>
                <span className="text-sm text-muted">
          Total Balance <span className="text-muted-dark">(USD)</span>
                </span>
            </div>
            <div className="text-center">
                <div className="text-6xl font-medium tabular-nums text-muted">
                    {visible ? <>
                        <span>$</span>
                        <span>{whole}</span>
                        <span className="text-muted-dark">.{cents}</span>
                    </> : <span>******</span>}
                </div>
            </div>
            <div className="flex items-center justify-center gap-2">
                <CaretUpIcon className={twMerge("w-[14px] h-[14px]", isPositive ? "text-success" : "text-danger")} />
                <span className={`text-sm font-medium tabular-nums ${isPositive ? "text-success" : "text-danger"}`}>
                    {visible ? <>
                        <span>$</span>
                        <span>{0}</span>
                    </> : <span>******</span>}
                </span>
                <span className={`text-sm font-medium tabular-nums ${isPositive ? "text-success" : "text-danger"}`}>
                    {visible ? <>
                        <span>+{0}%</span>
                    </> : <span>******</span>}
                </span>
            </div>
        </div>
    )
}