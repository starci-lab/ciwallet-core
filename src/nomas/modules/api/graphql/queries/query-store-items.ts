import type { GraphQLResponse } from "@/nomas/modules/api/graphql/types"
import { createNoCacheCredentialAuthClientWithHeaders } from "../clients"
import { gql } from "@apollo/client"

export enum QueryStoreItems {
    ListStoreItem = "ListStoreItem"
}

export const StoreItemsQueries = {
    [QueryStoreItems.ListStoreItem]: gql`
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

export type QueryStoreItemsParams = {
    query?: QueryStoreItems
    request: StoreItemsRequest
    headers: Record<string, string>
}

export const queryStoreItems = async ({
    query = QueryStoreItems.ListStoreItem,
    request,
    headers
}: QueryStoreItemsParams) => {
    if (!headers) throw new Error("Headers are required")
    if (!request) throw new Error("Request is required")

    const queryDocument = StoreItemsQueries[query]
    return await createNoCacheCredentialAuthClientWithHeaders(headers).query<{
        storeItems: GraphQLResponse<StoreItemsResponse>
    }>({
        query: queryDocument,
        variables: { request }
    })
}
