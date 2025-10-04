import React, { createContext, useContext, type FC, type PropsWithChildren } from "react"
import type { IStorageAdapter } from "./IStorageAdapter"

export interface StorageContextType {
    adapter: IStorageAdapter;
}

export interface StorageProviderProps extends PropsWithChildren {
   context: StorageContextType;
}

const StorageContext = createContext<StorageContextType | null>(null)

export const useStorage = (): StorageContextType => {
    const context = useContext(StorageContext)
    if (!context) {
        throw new Error("useStorage must be used within a StorageProvider")
    }
    return context
}

export const StorageProvider: FC<StorageProviderProps> = ({ children, context }) => {
    return (
        <StorageContext.Provider value={context}>
            {children}
        </StorageContext.Provider>
    )
}