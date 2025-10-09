import { WarningIcon } from "@phosphor-icons/react"
import React, { type PropsWithChildren } from "react"

export const NomasWarningText = ({ children }: PropsWithChildren) => {
    return (
        <div className="flex items-center gap-1">
            <WarningIcon className="w-4 h-4 text-danger" />
            <div className="text-danger text-xs">{children}</div>
        </div>
    )
}
