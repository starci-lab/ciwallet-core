import { createContext, type PropsWithChildren } from "react"
import { useGraphQLQueryGetListStoreItems } from "./queries/useGraphQLQueryGetListStoreItems"
import {
    useGraphQLMutationEphemeralColyseusSwrMutation,
    useGraphQLMutationVerifyMessageSwrMutation
} from "@/nomas/hooks/singleton/swr/graphql/mutations"
import { useGraphQLQueryRequestSignature } from "./queries/useGraphQLQueryRequestSignature"
import { useGraphQLQueryGetListPets } from "./queries/useGraphQLQueryPets"

export interface GraphQLContextType {
    getListStoreItems: ReturnType<typeof useGraphQLQueryGetListStoreItems>
    getListPets: ReturnType<typeof useGraphQLQueryGetListPets>
    verifyMessage: ReturnType<typeof useGraphQLMutationVerifyMessageSwrMutation>
    requestSignature: ReturnType<typeof useGraphQLQueryRequestSignature>
    requestColyseusEphemeralJwt: ReturnType<typeof useGraphQLMutationEphemeralColyseusSwrMutation>
}

export const GraphQLContext = createContext<GraphQLContextType | null>(null)

export const GraphQLProvider = ({ children }: PropsWithChildren) => {
    const getListStoreItems = useGraphQLQueryGetListStoreItems()
    const getListPets = useGraphQLQueryGetListPets()
    const verifyMessage = useGraphQLMutationVerifyMessageSwrMutation()
    const requestSignature = useGraphQLQueryRequestSignature()
    const requestColyseusEphemeralJwt = useGraphQLMutationEphemeralColyseusSwrMutation()
    return (
        <GraphQLContext.Provider
            value={{ getListStoreItems, getListPets, verifyMessage, requestSignature, requestColyseusEphemeralJwt }}
        >
            {children}
        </GraphQLContext.Provider>
    )
}
