import React, { type PropsWithChildren } from "react"
import { FormikProvider } from "./formiks"
import { MixinProvider } from "./mixin"
import { SwrProvider } from "./swr"
import { ColyseusProvider } from "./colyseus"
import { PhaserProvider } from "./phaser"
import { HyperliquidProvider } from "./hyperliquid"

export const SingletonHookProvider = ({ children }: PropsWithChildren) => {
    return (
        <ColyseusProvider>
            <PhaserProvider>
                <SwrProvider>
                    <MixinProvider>
                        <FormikProvider>
                            <HyperliquidProvider>
                                {children}
                            </HyperliquidProvider>
                        </FormikProvider>
                    </MixinProvider>
                </SwrProvider>
            </PhaserProvider>
        </ColyseusProvider>
    )
}
