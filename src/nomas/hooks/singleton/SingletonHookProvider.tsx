import React, { type PropsWithChildren } from "react"
import { DisclosureProvider } from "./discloresures"
import { FormikProvider } from "./formiks"
import { MixinProvider } from "./mixin"
import { WalletBootstrapProvider } from "./wallet/WalletBootstrap"

export const SingletonHookProvider = ({ children }: PropsWithChildren) => {
    return (
        <DisclosureProvider>
            <MixinProvider>
                <WalletBootstrapProvider>
                    <FormikProvider>{children}</FormikProvider>
                </WalletBootstrapProvider>
            </MixinProvider>
        </DisclosureProvider>
    )
}
