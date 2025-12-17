import { createContext, useContext, type PropsWithChildren } from "react"
import { useGraphQLQueryGetListStoreItems, useGraphQLQueryGetListPets } from "./queries"
import {
    useGraphQLMutationEphemeralColyseusSwrMutation,
    useGraphQLMutationRequestMessage,
    useGraphQLMutationRequestSignature,
    useGraphQLMutationVerifyMessageSwrMutation
} from "./mutations"

export interface GraphQLContextType {
    getListStoreItems: ReturnType<typeof useGraphQLQueryGetListStoreItems>
    getListPets: ReturnType<typeof useGraphQLQueryGetListPets>
    verifyMessage: ReturnType<typeof useGraphQLMutationVerifyMessageSwrMutation>
    requestSignature: ReturnType<typeof useGraphQLMutationRequestSignature>
    requestColyseusEphemeralJwt: ReturnType<typeof useGraphQLMutationEphemeralColyseusSwrMutation>
    requestMessage: ReturnType<typeof useGraphQLMutationRequestMessage>
}

export const GraphQLContext = createContext<GraphQLContextType | null>(null)

export const GraphQLProvider = ({ children }: PropsWithChildren) => {
    const getListStoreItems = useGraphQLQueryGetListStoreItems()
    const getListPets = useGraphQLQueryGetListPets()
    const verifyMessage = useGraphQLMutationVerifyMessageSwrMutation()
    const requestSignature = useGraphQLMutationRequestSignature()
    const requestColyseusEphemeralJwt = useGraphQLMutationEphemeralColyseusSwrMutation()
    const requestMessage = useGraphQLMutationRequestMessage()
    return (
        <GraphQLContext.Provider
            value={{
                getListStoreItems,
                getListPets,
                verifyMessage,
                requestSignature,
                requestColyseusEphemeralJwt,
                requestMessage
            }}
        >
            {children}
        </GraphQLContext.Provider>
    )
}

export const useGraphQL = () => {
    const context = useContext(GraphQLContext)
    if (!context) {
        throw new Error("GraphQLContext not found")
    }
    return context
}
