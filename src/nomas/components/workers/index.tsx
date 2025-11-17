import { BalanceWorker } from "./BalanceWorker"
import { HyperliquidWorker } from "./HyperliquidWorker"

export const Workers = () => {
    return (
        <>
            <HyperliquidWorker />
            <BalanceWorker />
        </>
    )
}   