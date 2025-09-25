import React, { createContext, useContext, type FC, type PropsWithChildren } from "react"
import type { ITransactionAdapter } from "./ITransactionAdapter"

export interface TransactionContextType {
    adapter: ITransactionAdapter;
}

export interface TransactionProviderProps extends PropsWithChildren {
   context: TransactionContextType;
}

const TransactionContext = createContext<TransactionContextType | null>(null)

export const useTransaction = (): TransactionContextType => {
    const context = useContext(TransactionContext)
    if (!context) {
        throw new Error("useTransaction must be used within a TransactionProvider")
    }
    return context
}

export const TransactionProvider: FC<TransactionProviderProps> = ({ children, context }) => {
    return (
        <TransactionContext.Provider value={context}>
            {children}
        </TransactionContext.Provider>
    )
}