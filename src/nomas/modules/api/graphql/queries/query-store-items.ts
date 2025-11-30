import type { GraphQLResponse } from "@/nomas/modules/api/graphql/types"
import { authClient } from "../clients"
import { gql } from "@apollo/client"

export enum QueryStoreItems {
    ListStoreItem = "ListStoreItem"
}

export const StoreItemsQueries = {
    [QueryStoreItems.ListStoreItem]: gql`
        query GameStoreItems {
            gameStoreItems {
                message
                success
                error
                data {
                    displayId
                    name
                    type
                    description
                    costNom
                    effectHunger
                    effectHappiness
                    effectCleanliness
                    effectDuration
                    createdAt
                    updatedAt
                }
            }
        }
    `
} as const

export type StoreItemType = "food" | "toy" | "clean" | "furniture" | "background" | "pet"

export interface StoreItem {
    id: string
    displayId: string
    name: string
    type: StoreItemType
    description?: string
    costNom: number
    effectHunger?: number
    effectHappiness?: number
    effectCleanliness?: number
    effectDuration?: number
    createdAt: string
    updatedAt: string
}

export interface StoreItemsResponse {
    items: StoreItem[]
}

export interface StoreItemsRequest {
    id: string
}

export type QueryStoreItemsParams = {
    query?: QueryStoreItems
}

export const queryStoreItems = async ({ query = QueryStoreItems.ListStoreItem }: QueryStoreItemsParams = {}) => {
    const queryDocument = StoreItemsQueries[query]

    return await authClient.query<{
        gameStoreItems: GraphQLResponse<StoreItem[]>
    }>({
        query: queryDocument,
        fetchPolicy: "no-cache"
    })
}
