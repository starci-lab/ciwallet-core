import React, { type PropsWithChildren } from "react"
import { FormikProvider } from "./formiks"
import { MixinProvider } from "./mixin"
import { SwrProvider } from "./swr"
import { ColyseusProvider } from "./colyseus"
import { PhaserProvider } from "./phaser"
import { HyperliquidProvider } from "./hyperliquid"
import { GraphQLProvider } from "./graphql"

export const SingletonHookProvider = ({ children }: PropsWithChildren) => {
    return (
        <GraphQLProvider>
            <ColyseusProvider>
                <PhaserProvider>
                    <SwrProvider>
                        <MixinProvider>
                            <HyperliquidProvider>
                                <FormikProvider>{children}</FormikProvider>
                            </HyperliquidProvider>
                        </MixinProvider>
                    </SwrProvider>
                </PhaserProvider>
            </ColyseusProvider>
        </GraphQLProvider>
    )
}
