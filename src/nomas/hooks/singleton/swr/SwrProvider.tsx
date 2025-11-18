import { createContext, type PropsWithChildren } from "react"
import { useGameAuthenticationSwrMutationCore } from "./useGameAuthenticationSwrMutation"
import { useGameLoadSwrMutationCore } from "./useGameLoadSwrMutation"
import { GraphQLProvider } from "./graphql"

export interface SwrProviderContextType {
  gameAuthenticationSwrMutation: ReturnType<
    typeof useGameAuthenticationSwrMutationCore
  >
  gameLoadSwrMutation: ReturnType<typeof useGameLoadSwrMutationCore>
}

export const SwrProviderContext = createContext<SwrProviderContextType | null>(
    null
)

export const SwrProvider = ({ children }: PropsWithChildren) => {
    const gameAuthenticationSwrMutation = useGameAuthenticationSwrMutationCore()
    const gameLoadSwrMutation = useGameLoadSwrMutationCore()
    return (
        <SwrProviderContext.Provider
            value={{ gameAuthenticationSwrMutation, gameLoadSwrMutation }}
        >
            <GraphQLProvider>{children}</GraphQLProvider>
        </SwrProviderContext.Provider>
    )
}
