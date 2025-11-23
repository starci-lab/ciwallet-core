import { createContext, type PropsWithChildren } from "react"
import { useGraphQLQueryGetListStoreItems } from "./queries/useGraphQLQueryGetListStoreItems"
import { useGraphQLMutationVerifyMessageSwrMutation } from "@/nomas/hooks/singleton/swr/graphql/mutations"

export interface GraphQLContextType {
  getListStoreItems: ReturnType<typeof useGraphQLQueryGetListStoreItems>
  verifyMessage: ReturnType<typeof useGraphQLMutationVerifyMessageSwrMutation>
}

export const GraphQLContext = createContext<GraphQLContextType | null>(null)

export const GraphQLProvider = ({ children }: PropsWithChildren) => {
    const getListStoreItems = useGraphQLQueryGetListStoreItems()
    const verifyMessage = useGraphQLMutationVerifyMessageSwrMutation()
    return (
        <GraphQLContext.Provider value={{ getListStoreItems, verifyMessage }}>
            {children}
        </GraphQLContext.Provider>
    )
}
