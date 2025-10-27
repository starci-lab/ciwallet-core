import { createContext, type PropsWithChildren } from "react"
import { useGameAuthenticationSwrCore } from "./useGameAuthenticationSwr"

export interface SwrProviderContextType {
    gameAuthenticationSwr: ReturnType<typeof useGameAuthenticationSwrCore>
}
  
export const SwrProviderContext = createContext<SwrProviderContextType | null>(
    null
)

export const SwrProvider = ({ children }: PropsWithChildren) => {
    const gameAuthenticationSwr = useGameAuthenticationSwrCore()
    return (
        <SwrProviderContext.Provider value={{ gameAuthenticationSwr }}>
            {children}
        </SwrProviderContext.Provider>
    )
}