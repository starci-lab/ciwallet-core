import React, { type PropsWithChildren } from "react"
import { FormikProvider } from "./formiks"
import { MixinProvider } from "./mixin"
import { SwrProvider } from "./swr"
import { ColyseusProvider } from "./colyseus"
import { PhaserProvider } from "./phaser"

export const SingletonHookProvider = ({ children }: PropsWithChildren) => {
    return (
        <ColyseusProvider>
            <PhaserProvider>
                <SwrProvider>
                    <MixinProvider>
                        <FormikProvider>{children}</FormikProvider>
                    </MixinProvider>
                </SwrProvider>
            </PhaserProvider>
        </ColyseusProvider>
    )
}
