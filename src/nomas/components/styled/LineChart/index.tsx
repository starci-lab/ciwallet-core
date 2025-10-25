"use client"
import React, { useEffect, useState } from "react"
import {
    AreaChart,
    Area,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import dayjs from "dayjs"
import { faker } from "@faker-js/faker"

interface ChartPoint {
    time: string
    price: number
}

interface LineChartProps {
    data?: Array<ChartPoint>
}

export const LineChart: React.FC<LineChartProps> = ({ data }) => {
    const [chartData, setChartData] = useState<Array<ChartPoint>>([])
    useEffect(() => {
        if (data && data.length) {
            setChartData(data)
        } else {
            const now = dayjs()
            const points = Array.from({ length: 60 }, (_, i) => ({
                time: now.subtract(60 - i, "minute").toISOString(),
                price: 2.4 + Math.sin(i / 5) * 0.05 + faker.number.float({ min: -0.01, max: 0.01 }),
            }))
            setChartData(points)
        }
    }, [data])

    const first = chartData[0]?.price ?? 0
    const last = chartData[chartData.length - 1]?.price ?? 0
    const isUp = last >= first
    const strokeColor = isUp ? "#16c784" : "#ea3943"

    return (
        <div className="w-full h-[280px] p-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25}/>
                            <stop offset="100%" stopColor={strokeColor} stopOpacity={0}/>
                        </linearGradient>
                    </defs>

                    <XAxis
                        dataKey="time"
                        axisLine={false}
                        tickLine={false}
                        minTickGap={50}
                        tickFormatter={(t) => dayjs(t).format("HH:mm")}
                        tick={{ fontSize: 12, fill: "#999" }}
                    />
                    <YAxis
                        domain={["auto", "auto"]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#999" }}
                        width={50}
                        orientation="right"
                    />

                    {/* Tooltip hover kiểu CoinMarketCap */}
                    <Tooltip
                        cursor={{ stroke: "#ccc", strokeDasharray: "3 3" }}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const p = payload[0].payload
                                return (
                                    <div className="bg-white border border-gray-200 shadow-md rounded-md px-3 py-2 text-xs">
                                        <div className="font-semibold text-gray-800">
                                            ${p.price.toFixed(4)}
                                        </div>
                                        <div className="text-gray-500">
                                            {dayjs(p.time).format("MMM D, HH:mm")}
                                        </div>
                                    </div>
                                )
                            }
                            return null
                        }}
                    />

                    <Area
                        type="monotone"
                        dataKey="price"
                        stroke={strokeColor}
                        strokeWidth={2}
                        fill="url(#areaFill)"
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}