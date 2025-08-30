import React from "react"
import { useSwapFormik } from "@/nomas/hooks"
import { NomasAvatar, NomasAvatarGroup, NomasLink } from "@/nomas/components"
import { ArrowsOut } from "phosphor-react"
export const AutoRouter = () => {
    const swapFormik = useSwapFormik()
    return (
        <div className="flex gap-1">
            <NomasAvatarGroup className="gap-1">
                {
                    swapFormik.values.protocols.map((protocol) => (
                        <NomasAvatar dimension="shrink" key={protocol.id} src={protocol.logo} />
                    ))
                }
            </NomasAvatarGroup>
            <NomasLink color="foreground">
                <ArrowsOut/>
            </NomasLink>
        </div>
    )
}