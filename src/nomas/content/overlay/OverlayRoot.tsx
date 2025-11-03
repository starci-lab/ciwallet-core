// src/content/overlay/OverlayRoot.tsx
import React from "react"
import { Nomas } from "../../Nomas"
import { contentEventBus } from "../bus"
/**
 * OverlayRoot represents the entire wallet panel UI structure.
 * It replaces the manual DOM creation & innerHTML.
 */
export const OverlayRoot: React.FC = () => {
    return (
        <Nomas contentEventBus={contentEventBus} />
    )
}