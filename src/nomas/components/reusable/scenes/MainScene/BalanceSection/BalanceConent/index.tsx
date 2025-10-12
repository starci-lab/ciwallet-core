import React, { useState } from "react"
import { NomasLink } from "@/nomas/components"
import { CaretUpIcon, EyeClosedIcon, EyeIcon } from "@phosphor-icons/react"
import { twMerge } from "tailwind-merge"

export const BalanceContent = () => {
    const [visible, setVisible] = useState(true)

    const balance = 0
    const changeValue = 0
    const changePercent = 0
    const isPositive = changeValue >= 0

    return (
        <div className="flex flex-col items-center justify-center py-8 px-4 gap-4">
            <div className="flex items-center gap-2">
                <NomasLink onClick={() => setVisible((v) => !v)}>
                    {visible ? <EyeIcon /> : <EyeClosedIcon />}
                </NomasLink>
                <span className="text-sm text-muted">
          Total Balance <span className="text-muted">(USD)</span>
                </span>
            </div>
            <div className="text-center">
                <div className="text-6xl font-medium tabular-nums text-muted">
                    {visible ? <>
                        <span>$</span>
                        <span>{balance}</span>
                        <span className="text-muted-dark">.00</span>
                    </> : <span>******</span>}
                </div>
            </div>
            <div className="flex items-center justify-center gap-2">
                <CaretUpIcon className={twMerge("w-[14px] h-[14px]", isPositive ? "text-success" : "text-danger")} />
                <span className={`text-sm font-medium tabular-nums ${isPositive ? "text-success" : "text-danger"}`}>
                    {visible ? <>
                        <span>$</span>
                        <span>{changeValue.toFixed(3)}</span>
                    </> : <span>******</span>}
                </span>
                <span className={`text-sm font-medium tabular-nums ${isPositive ? "text-success" : "text-danger"}`}>
                    {visible ? <>
                        <span>+{changePercent}%</span>
                    </> : <span>******</span>}
                </span>
            </div>
        </div>
    )
}