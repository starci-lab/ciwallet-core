import React from "react"
import { useSwapFormik } from "@/nomas/hooks/singleton"
import { NomasImage, NomasLink } from "@/nomas/components"
import { ArrowsOut } from "phosphor-react"
export const AutoRouter = () => {
    const swapFormik = useSwapFormik()
    return (
        <div className="flex gap-1">
            {
                swapFormik.values.protocols.map((protocol) => (
                    <NomasImage 
                        key={protocol.id}
                        src={protocol.logo}
                        className="w-8 h-8"
                    />
                ))
            }
            <NomasLink color="foreground">
                <ArrowsOut/>
            </NomasLink>
        </div>
    )
}