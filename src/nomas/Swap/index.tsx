import React, { useEffect, useState } from "react"
import { useAggregators } from "@ciwallet-sdk/hooks"
import { Button } from "@heroui/react"
export const Swap = () => {
    const { ciAggregator } = useAggregators()
    const [data, setData] = useState<any>(null)
    useEffect(() => {
        ciAggregator.quote({
            fromToken: "USDC",
            toToken: "USDT",
            amount: 100,
            exactIn: true,
        }).then((res) => {
            setData(res)
        })
    }, [])
    return (
        <div>
            <h1>Swap</h1>
            <Button>
              123
            </Button>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    )
}