import type { GraphQLResponse } from "@/nomas/modules/api/graphql/types"
import { createNoCacheCredentialAuthClientWithHeaders } from "../clients"
import { gql } from "@apollo/client"

// -------------------
// GQL Queries Object
// -------------------
export const StoreItemsQueries = {
    Query1: gql`
        query StoreItems($request: StoreItemsRequest!) {
            storeItems(request: $request) {
                message
                success
                error
                data {
                    items {
                        id
                        name
                        description
                        price
                        image
                    }
                }
            }
        }
    `
} as const

// -------------------
// Types
// -------------------
export interface StoreItemsResponse {
    items: {
        id: string
        name: string
        description: string
        price: number
        image: string
    }[]
}

export interface StoreItemsRequest {
    id: string
}

// -------------------
// Function
// -------------------
export type QueryStoreItemsParams = {
    query?: (typeof StoreItemsQueries)[keyof typeof StoreItemsQueries]
    request: StoreItemsRequest
    headers: Record<string, string>
}

export const queryStoreItems = async ({
    query = StoreItemsQueries.Query1,
    request,
    headers
}: QueryStoreItemsParams) => {
    if (!headers) throw new Error("Headers are required")

    return await createNoCacheCredentialAuthClientWithHeaders(headers).query<{
        storeItems: GraphQLResponse<StoreItemsResponse>
    }>({
        query,
        variables: { request }
    })
}
