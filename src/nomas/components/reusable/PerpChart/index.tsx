import { LightweightChart } from "@/nomas/components"
import type { CandleSnapshots } from "@ciwallet-sdk/classes"

interface PerpChartProps {
    candleSnapshots: CandleSnapshots
}
export const PerpChart = ({ candleSnapshots }: PerpChartProps) => {
    return <LightweightChart candleSnapshots={candleSnapshots} height={200} />
}