import { useContext } from "react"
import { HyperliquidContext } from "./HyperliquidProvider"
import { useDispatch } from "react-redux"
import { HyperliquidAssetId } from "@ciwallet-sdk/classes"
import { setCandleSnapshots, setPositionCandleSnapshots, useAppSelector } from "@/nomas/redux"
import dayjs from "dayjs"
import Decimal from "decimal.js"
import { infoHyperliquidObj } from "@/nomas/obj"
import useSWR from "swr"

export interface CandleSnapshot {
    interval: CandleInterval
    startTime: number
}

const maxCandles = 72
const interval: Array<CandleSnapshot> = [
    { 
        interval: "1m", startTime: new Decimal(dayjs().valueOf()).sub(
            new Decimal(maxCandles).mul(new Decimal(60).mul(1000))
        ).toNumber() },
    { 
        interval: "5m", startTime: new Decimal(dayjs().valueOf()).sub(
            new Decimal(maxCandles).mul(new Decimal(60).mul(5).mul(1000))
        ).toNumber() 
    },
    { 
        interval: "15m", startTime: new Decimal(dayjs().valueOf()).sub(
            new Decimal(maxCandles).mul(new Decimal(60).mul(15).mul(1000))
        ).toNumber() 
    },
    { 
        interval: "30m", startTime: new Decimal(dayjs().valueOf()).sub(
            new Decimal(maxCandles).mul(new Decimal(60).mul(30).mul(1000))
        ).toNumber()
    },
    { 
        interval: "1h", startTime: new Decimal(dayjs().valueOf()).sub(
            new Decimal(maxCandles).mul(new Decimal(60).mul(60).mul(1000))
        ).toNumber()
    },
    { 
        interval: "4h", startTime: new Decimal(dayjs().valueOf()).sub(
            new Decimal(maxCandles).mul(new Decimal(60).mul(60).mul(4).mul(1000))
        ).toNumber() 
    },
    { 
        interval: "1d", startTime: new Decimal(dayjs().valueOf()).sub(
            new Decimal(maxCandles).mul(new Decimal(60).mul(60).mul(24).mul(1000))
        ).toNumber() 
    },
]

export const useHyperliquidCandleSnapshotSwrCore = () => {
    const dispatch = useDispatch()
    const selectedAssetId = useAppSelector((state) => state.stateless.sections.perp.selectedAssetId)
    const candleInterval = useAppSelector((state) => state.stateless.sections.perp.candleInterval)
    const network = useAppSelector((state) => state.persists.session.network)
    const positionAssetId = useAppSelector((state) => state.stateless.sections.perp.positionAssetId)

    const candleSnapshotSwr = useSWR(
        ["hyperliquid-candle-snapshot", network, selectedAssetId, candleInterval],
        async () => {
            const candleSnapshots = await infoHyperliquidObj.candleSnapshot({
                clientParams: { network },
                assetId: selectedAssetId,
                interval: candleInterval,
                startTime: interval.find((interval) => interval.interval === candleInterval)?.startTime || 0,
            })
            dispatch(setCandleSnapshots(candleSnapshots))
        }
    )

    const positionCandleSnapshotSwr = useSWR(
        positionAssetId ? ["hyperliquid-position-candle-snapshot", network, positionAssetId, candleInterval] : null,
        async () => {
            const candleSnapshots = await infoHyperliquidObj.candleSnapshot({
                clientParams: { network },
                assetId: positionAssetId,
                interval: candleInterval,
                startTime: interval.find((interval) => interval.interval === candleInterval)?.startTime || 0,
            })
            dispatch(setPositionCandleSnapshots(candleSnapshots))
        }
    )

    return {
        candleSnapshotSwr,
        positionCandleSnapshotSwr,
    }
}

export const useHyperliquidCandleSnapshotSwr = () => {
    const context = useContext(HyperliquidContext)
    if (!context) {
        throw new Error("Hyperliquid context not found")
    }
    return context.useHyperliquidCandleSnapshotSwr
}

export type CandleInterval = "1m" | "5m" | "15m" | "30m" | "1h" | "4h" | "1d"
export interface GetCandleSnapshotParams {
    assetId: HyperliquidAssetId
    interval: CandleInterval
    startTime: number
}