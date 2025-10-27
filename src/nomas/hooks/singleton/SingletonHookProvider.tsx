import React, { type PropsWithChildren } from "react"
import { FormikProvider } from "./formiks"
import { MixinProvider } from "./mixin"
import { SwrProvider } from "./swr"

export const SingletonHookProvider = ({ children }: PropsWithChildren) => {
    return (
        <SwrProvider>
            <MixinProvider>
                <FormikProvider>{children}</FormikProvider>
            </MixinProvider>
        </SwrProvider>
    )
}
