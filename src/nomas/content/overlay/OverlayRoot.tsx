// src/content/overlay/OverlayRoot.tsx
import React from "react"
import { Nomas } from "../../Nomas"
import { motion } from "framer-motion"

/**
 * OverlayRoot represents the entire wallet panel UI structure.
 * It replaces the manual DOM creation & innerHTML.
 */
export const OverlayRoot: React.FC = () => {
    return (
        <div className="fixed inset-0 z-50 pointer-events-none">
            <motion.div
                drag
                dragMomentum={false}
                className="absolute top-10 left-10 pointer-events-auto"
            >
                <Nomas />
            </motion.div>
        </div>
    )
}