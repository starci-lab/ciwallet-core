import { useMemo } from "react"
import {
    useAppSelector,
    selectSelectedAccountByPlatform,
} from "@/nomas/redux"
import { Platform } from "@ciwallet-sdk/types"
import { useSubscribeAllMids } from "./useSubscribeAllMids"
import { useSubscribeCandle } from "./useSubscribeCandle"
import { useSubscribeClearingHouseData } from "./useSubscribeClearingHouseData"
import { useSubscribeActiveAssetCtx } from "./useSubscribeActiveAssetCtx"
import { useSubscribePositionAssetCtx } from "./useSubscribeActiveAssetCtx"
import { useSubscribePositionCandle } from "./useSubscribeCandle"
import { useSubscribeOpenOrders } from "./useSubscribeOpenOrders"
import { subscriptionHyperliquidObj } from "@/nomas/obj"
import { useSubscribeActiveAssetData } from "./useSubscribeActiveAssetData"

export const useHyperliquidSubscriptionCore = () => {
    const network = useAppSelector((state) => state.persists.session.network)
    const selectedAssetId = useAppSelector((state) => state.stateless.sections.perp.selectedAssetId)
    const positionAssetId = useAppSelector((state) => state.stateless.sections.perp.positionAssetId)
    const candleInterval = useAppSelector((state) => state.stateless.sections.perp.candleInterval)
    const selectedAccount = useAppSelector((state) =>
        selectSelectedAccountByPlatform(state.persists, Platform.Evm)
    )

    // Create subscription client
    const client = useMemo(
        () => subscriptionHyperliquidObj.getSubscriptionClient({ network }),
        [network]
    )

    // Individual subscription hooks
    useSubscribeAllMids(client)
    useSubscribeCandle(client, selectedAssetId, candleInterval)
    useSubscribeClearingHouseData(client, selectedAccount?.accountAddress || "")
    useSubscribeActiveAssetCtx(client, selectedAssetId)
    useSubscribePositionAssetCtx(client, positionAssetId)
    useSubscribePositionCandle(client, positionAssetId, candleInterval)
    useSubscribeOpenOrders(client, selectedAccount?.accountAddress || "")
    useSubscribeActiveAssetData(client, selectedAssetId, selectedAccount?.accountAddress || "")
}