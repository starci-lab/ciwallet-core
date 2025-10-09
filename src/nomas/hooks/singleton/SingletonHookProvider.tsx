import React, { type PropsWithChildren } from "react"
import { FormikProvider } from "./formiks"
import { MixinProvider } from "./mixin"

export const SingletonHookProvider = ({ children }: PropsWithChildren) => {
    return (
        <MixinProvider>
            <FormikProvider>{children}</FormikProvider>
        </MixinProvider>
    )
}
