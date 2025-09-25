import React, { useMemo, useState } from "react"
import { Eye, EyeSlash, CaretUp } from "phosphor-react"

function useMoneyParts(amount: number) {
    return useMemo(() => {
        const s = amount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true,
        })
        const [whole, cents] = s.split(".")
        return { whole, cents }
    }, [amount])
}

export const BalanceContent = () => {
    const [isBalanceVisible, setIsBalanceVisible] = useState(true)

    const totalBalance = 686.86
    const changeAmount = 200.666
    const changePercentage = 10.46

    const { whole, cents } = useMoneyParts(totalBalance)

    return (
        <div className="flex flex-col items-center justify-center py-8 px-4">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
                <button
                    onClick={() => setIsBalanceVisible((v) => !v)}
                    className="p-1 rounded-full hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/10"
                    aria-label={isBalanceVisible ? "Hide balance" : "Show balance"}
                >
                    {isBalanceVisible ? (
                        <Eye size={18} className="text-foreground-300" />
                    ) : (
                        <EyeSlash size={18} className="text-foreground-300" />
                    )}
                </button>
                <span className="text-foreground-300 text-[13px] tracking-wide">
          Total Balance <span className="opacity-70">(USD)</span>
                </span>
            </div>

            {/* Balance */}
            <div className="text-center mb-3">
                <div
                    className={[
                        "font-light tabular-nums",
                        // sizes look close to the mock; bump on md+
                        "text-[42px] md:text-[56px] leading-none",
                        isBalanceVisible
                            ? "text-foreground"
                            : "text-foreground-400/70 blur-[1px]",
                    ].join(" ")}
                >
                    {isBalanceVisible ? (
                        <>
                            <span className="align-baseline">$</span>
                            <span>{whole}</span>
                            <span className="text-foreground-500">.{cents}</span>
                        </>
                    ) : (
                    // keep width similar when hidden (privacy blur)
                        <>$••••••</>
                    )}
                </div>

                {/* Change row */}
                <div className="mt-3 flex items-center justify-center gap-2">
                    <CaretUp size={16} className="text-green-400" />
                    <span className="text-green-400 text-sm font-medium tabular-nums">
                        {isBalanceVisible ? `$${changeAmount.toFixed(3)}` : "••••"}
                    </span>
                    <span className="text-green-400 text-sm font-medium tabular-nums">
            +{changePercentage.toFixed(2)}%
                    </span>
                </div>
            </div>
        </div>
    )
}
