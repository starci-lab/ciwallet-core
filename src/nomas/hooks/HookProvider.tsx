import React, { type PropsWithChildren } from "react"
import { DisclosureProvider } from "./discloresures"
import { FormikProvider } from "./formiks"

export const HookProvider = ({ children }: PropsWithChildren) => {
    return (
        <DisclosureProvider>
            <FormikProvider>{children}</FormikProvider>
        </DisclosureProvider>
    )
}
