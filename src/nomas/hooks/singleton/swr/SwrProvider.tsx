import { createContext, type PropsWithChildren } from "react"
import { useGameAuthenticationSwrMutationCore } from "./useGameAuthenticationSwrMutation"

export interface SwrProviderContextType {
    gameAuthenticationSwrMutation: ReturnType<typeof useGameAuthenticationSwrMutationCore>
}
  
export const SwrProviderContext = createContext<SwrProviderContextType | null>(
    null
)

export const SwrProvider = ({ children }: PropsWithChildren) => {
    const gameAuthenticationSwrMutation = useGameAuthenticationSwrMutationCore()
    return (
        <SwrProviderContext.Provider value={{ gameAuthenticationSwrMutation }}>
            {children}
        </SwrProviderContext.Provider>
    )
}