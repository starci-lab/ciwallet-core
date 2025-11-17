import { useEffect, useRef, useState } from "react"
import { CandlestickSeries, createChart, type CandlestickData, type Time, type IChartApi, type ISeriesApi, HistogramSeries, type HistogramData } from "lightweight-charts"

interface CandleSnapshot {
    t: number // start time (ms)
    o: string
    h: string
    l: string
    c: string
    v: string
}

interface LightweightChartProps {
    candleSnapshots: Array<CandleSnapshot>
    height?: number
}

export const LightweightChart = ({ candleSnapshots, height = 400 }: LightweightChartProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<IChartApi>(null)
    const candleSeriesRef = useRef<ISeriesApi<"Candlestick">>(null)
    const volumeSeriesRef = useRef<ISeriesApi<"Histogram">>(null)
    const [initialized, setInitialized] = useState(false)
    useEffect(() => {
        if (!containerRef.current) return
        chartRef.current = createChart(
            containerRef.current, {
                width: containerRef.current.clientWidth,
                height: height,
                layout: {
                    background: { color: "transparent" },
                    textColor: "#aaa",
                    attributionLogo: false ,
                },
                grid: {
                    vertLines: { color: "rgba(255,255,255,0.05)" },
                    horzLines: { color: "rgba(255,255,255,0.05)" },
                },
                rightPriceScale: {
                    borderVisible: false,
                    scaleMargins: { top: 0.1, bottom: 0.25 }
                },
                handleScale: {
                    mouseWheel: true,
                    pinch: true,
                    axisDoubleClickReset: true,
                    axisPressedMouseMove: true,
                },
                handleScroll: {
                    mouseWheel: true,
                    horzTouchDrag: true,
                    vertTouchDrag: true,
                    pressedMouseMove: true,
                },
                timeScale: {
                    visible: true,
                    borderVisible: false,
                    timeVisible: true,
                    secondsVisible: false,
                    tickMarkFormatter: (time: Time) => {
                        const date = new Date((time as number) * 1000)
                        return date.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false, // use 24h format, remove this line if you want AM/PM
                        })
                    },
                },
                crosshair: {
                    mode: 1,
                },
            })
        candleSeriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
            priceScaleId: "right",
        })
        volumeSeriesRef.current = chartRef.current.addSeries(HistogramSeries, {
            priceScaleId: "",
            priceFormat: { type: "volume" },
        })
        chartRef.current.priceScale("").applyOptions({
            scaleMargins: { top: 0.8, bottom: 0 }, // volume thấp hơn & nhỏ hơn
        })
        const handleResize = () => {
            chartRef.current!.applyOptions({ width: containerRef.current!.clientWidth })
        }
        window.addEventListener("resize", handleResize)
        setInitialized(true)
        return () => {
            chartRef.current!.remove()
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    useEffect(() => {
        if (!initialized) return
        if (!chartRef.current) return
        const data: Array<CandlestickData<Time>> = candleSnapshots.map(c => ({
            time: (c.t/1000) as Time,
            startTime: (c.t/1000) as Time,
            endTime: (c.t/1000) as Time,
            open: parseFloat(c.o),
            high: parseFloat(c.h),
            low: parseFloat(c.l),
            close: parseFloat(c.c),
        }))
        candleSeriesRef.current!.setData(data)

        const volumeData: Array<HistogramData<Time>> = candleSnapshots.map(c => ({
            time: (c.t/1000) as Time,
            value: parseFloat(c.v),
            color: parseFloat(c.c) >= parseFloat(c.o) ? "#11564A" : "#7C2930",
        }))
        volumeSeriesRef.current!.setData(volumeData)
    }, [candleSnapshots, initialized])

    return <div ref={containerRef} className="w-full" style={{ height: `${height}px` }} />
}