import React, { createContext, useContext, type FC, type PropsWithChildren } from "react"
import type { IWalletAdapter } from "./IWalletAdapter"
import type { ChainId } from "@/types"

export interface WalletKitContextType {
    adapter: IWalletAdapter;
    // suitable for who is using the wallet kit provider
    uniqueChainId: ChainId;
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