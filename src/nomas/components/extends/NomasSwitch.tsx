import React from "react"
import { Switch } from "../shadcn"
import type { WithClassName } from "@ciwallet-sdk/types"

export interface NomasSwitchProps extends WithClassName {
    addConfetti?: boolean
}
export const NomasSwitch = (
    props: NomasSwitchProps & React.ComponentProps<typeof Switch>
) => {
    return (
        <Switch {...props} />
    )
}