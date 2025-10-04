import React, { createContext, useContext, type FC, type PropsWithChildren } from "react"
import type { IWalletAdapter } from "./IWalletAdapter"

export interface WalletKitContextType {
    adapter: IWalletAdapter;
}

export interface WalletKitProviderProps extends PropsWithChildren {
   context: WalletKitContextType;
}

const WalletKitContext = createContext<WalletKitContextType | null>(null)

export const useWalletKit = (): WalletKitContextType => {
    const context = useContext(WalletKitContext)
    if (!context) {
        throw new Error("useWalletKit must be used within a WalletKitProvider")
    }
    return context
}

export const WalletKitProvider: FC<WalletKitProviderProps> = ({ children, context }) => {
    return (
        <WalletKitContext.Provider value={context}>
            {children}
        </WalletKitContext.Provider>
    )
}
