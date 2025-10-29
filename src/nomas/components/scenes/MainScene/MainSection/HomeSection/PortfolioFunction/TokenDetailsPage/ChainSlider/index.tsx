"use client"
import { motion } from "framer-motion"
import { chainManagerObj } from "@/nomas/obj"
import { setSelectedChainId, useAppDispatch, useAppSelector, type SelectedChainId } from "@/nomas/redux"
import { twMerge } from "tailwind-merge"

export const ChainSlider = () => {
    const chains = chainManagerObj.toObject()
    const selectedChainId = useAppSelector((state) => state.stateless.sections.home.selectedChainId)
    const map: Array<{ id: SelectedChainId, value: string }> = [
        {
            id: "overview",
            value: "Overview",
        },
        ...Object.values(chains).map((chain) => ({
            id: chain.id,
            value: chain.name,
        })),
    ]
    const dispatch  = useAppDispatch()
    return (
        <div className="overflow-hidden px-4 select-none">
            <motion.div
                className="flex gap-4 cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={{ left: -500, right: 0 }}
                dragElastic={0.15} 
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {map.map((item) => {
                    const isSelected = selectedChainId === item.id
                    return (
                        <motion.div
                            key={item.id.toString()}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                dispatch(setSelectedChainId(item.id))
                            }}
                            className="flex flex-col items-center min-w-[64px]"
                        >
                            <div className={
                                twMerge("text-sm text-muted mt-1 h-8 relative", isSelected && "text")
                            }>
                                {item.value}
                                {isSelected && (
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[20px] h-1 bg-white" />
                                )}
                            </div>
                        </motion.div>
                    )
                })}
            </motion.div>
        </div>
    )
}