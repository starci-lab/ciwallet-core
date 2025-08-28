import React, { type PropsWithChildren } from "react"
import { DisclosureProvider } from "./discloresures"

export const HookProvider = ({ children }: PropsWithChildren) => {
    return <DisclosureProvider>{children}</DisclosureProvider>
}
