import * as hl from "@nktkas/hyperliquid"
import { useCallback, useContext, useEffect, useLayoutEffect } from "react"
import { HyperliquidContext } from "./HyperliquidProvider"
import { useDispatch } from "react-redux"
import { setCandleSnapshots, setPerpMetas } from "@/nomas/redux"
import type { HyperliquidMarketId } from "@ciwallet-sdk/classes"
import { useAppSelector } from "@/nomas/redux"
import dayjs from "dayjs"
import Decimal from "decimal.js"

export interface CandleSnapshot {
    interval: CandleInterval
    startTime: number
}

const infoClient = new hl.InfoClient({
    transport: new hl.HttpTransport(), // or `WebSocketTransport`
})
export const useHyperliquidInfoCore = () => {
    const dispatch = useDispatch()
    const selectedMarketId = useAppSelector((state) => state.stateless.sections.perp.selectedMarketId)
    const candleInterval = useAppSelector((state) => state.stateless.sections.perp.candleInterval)
    
    const openOrders = useCallback(async (userAddress: string) => {
        const orders = await infoClient.openOrders({
            user: userAddress,
        })
        console.log(orders)
    }, [])

    useLayoutEffect(() => {
        const handleEffect = async () => {
            const perpsMeta = await infoClient.allPerpMetas()
            dispatch(setPerpMetas(perpsMeta))
        }
        handleEffect()
    }, [])
    
    const getCandleSnapshot = useCallback(async ({ marketId, interval, startTime }: GetCandleSnapshotParams) => {
        const candleSnapshot = await infoClient.candleSnapshot({
            coin: marketId,
            interval,
            startTime,
        })
        return candleSnapshot
    }, [])
    
    useEffect(() => {
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
        const handleEffect = async () => {  
            const candleSnapshot = await getCandleSnapshot({
                marketId: selectedMarketId,
                interval: candleInterval,
                startTime: interval.find((interval) => interval.interval === candleInterval)?.startTime ?? 0,
            })
            dispatch(setCandleSnapshots(candleSnapshot))
        }
        handleEffect()
    }, [selectedMarketId, candleInterval])

    return {
        openOrders,
        getCandleSnapshot,
    }
}

export const useHyperliquidInfo = () => {
    const context = useContext(HyperliquidContext)
    if (!context) {
        throw new Error("Hyperliquid context not found")
    }
    return context.useHyperliquidInfo
}

export type CandleInterval = "1m" | "5m" | "15m" | "30m" | "1h" | "4h" | "1d"
export interface GetCandleSnapshotParams {
    marketId: HyperliquidMarketId
    interval: CandleInterval
    startTime: number
}