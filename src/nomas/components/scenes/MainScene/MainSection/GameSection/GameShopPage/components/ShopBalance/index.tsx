import { NomasImage, NomasInput } from "@/nomas/components"

interface ShopBalanceProps {
    balance: number
    assets: ReturnType<typeof import("@/nomas/resources").assetsConfig>["game"]
}

/**
 * ShopBalance - Balance display section
 */
export const ShopBalance = ({ balance, assets }: ShopBalanceProps) => {
    return (
        <div className="bg-card-dark-4 px-2 py-1 border-b border-muted">
            <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-2">
                    <div>
                        <div className="text-xstext-text-muted pl-1">Balance</div>
                        <NomasInput
                            value={balance.toLocaleString()}
                            prefixIcon={<NomasImage src={assets.nomasCoin} alt="NOM" className="w-3 h-3" />}
                            currency="NOM"
                            numericOnly
                            readOnly
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

