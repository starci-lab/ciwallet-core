import { createContext, type PropsWithChildren } from "react"
import { useGameAuthenticationSwrMutationCore } from "./useGameAuthenticationSwrMutation"
import { useGameLoadSwrMutationCore } from "./useGameLoadSwrMutation"

export interface SwrProviderContextType {
    gameAuthenticationSwrMutation: ReturnType<typeof useGameAuthenticationSwrMutationCore>
    gameLoadSwrMutation: ReturnType<typeof useGameLoadSwrMutationCore>
}
  
export const SwrProviderContext = createContext<SwrProviderContextType | null>(
    null
)

export const SwrProvider = ({ children }: PropsWithChildren) => {
    const gameAuthenticationSwrMutation = useGameAuthenticationSwrMutationCore()
    const gameLoadSwrMutation = useGameLoadSwrMutationCore()
    return (
        <SwrProviderContext.Provider value={{ gameAuthenticationSwrMutation, gameLoadSwrMutation }}>
            {children}
        </SwrProviderContext.Provider>
    )
}