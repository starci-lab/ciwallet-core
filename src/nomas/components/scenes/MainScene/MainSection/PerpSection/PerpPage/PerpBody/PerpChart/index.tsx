import { LightweightChart } from "@/nomas/components"
import { useAppSelector } from "@/nomas/redux"

export const PerpChart = () => {
    const candleSnapshots = useAppSelector((state) => state.stateless.sections.perp.candleSnapshots)
    return <LightweightChart candleSnapshots={candleSnapshots} height={200} />
}