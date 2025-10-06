// src/content/overlay/OverlayRoot.tsx

import React from "react"
import { Nomas } from "../../Nomas"
/**
 * OverlayRoot represents the entire wallet panel UI structure.
 * It replaces the manual DOM creation & innerHTML.
 */
export const OverlayRoot: React.FC = () => {
    return (
        <div className="wallet-overlay">
            <div className="wallet-container" id="nomas-wallet-root">
                <div id="nomas-react-root" style={{ width: "100%", height: "100%" }}>
                    <Nomas />
                </div>
            </div>
        </div>
    )
}