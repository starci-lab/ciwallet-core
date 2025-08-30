import React, { type PropsWithChildren } from "react"
import { DisclosureProvider } from "./discloresures"
import { FormikProvider } from "./formiks"
import { MixinProvider } from "./mixin"

export const HookProvider = ({ children }: PropsWithChildren) => {
    return (
        <DisclosureProvider>
            <MixinProvider>
                <FormikProvider>{children}</FormikProvider>
            </MixinProvider>
        </DisclosureProvider>
    )
}
