import { createNoCacheCredentialAuthClientWithHeaders } from "../clients"
import type { GraphQLResponse, QueryParams } from "../types"
import { gql, type DocumentNode } from "@apollo/client"

const query1 = gql`
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

export interface StoreItemsResponse {
  items: {
    id: string
    name: string
    description: string
    price: number
    image: string
  }[]
}

export enum QueryStoreItems {
  Query1 = "query1",
}

export interface StoreItemsRequest {
  id: string
}

const queryMap: Record<QueryStoreItems, DocumentNode> = {
    [QueryStoreItems.Query1]: query1,
}

export type QueryStoreItemsParams = QueryParams<
  QueryStoreItems,
  StoreItemsRequest
>

export const queryStoreItems = async ({
    query = QueryStoreItems.Query1,
    request,
    headers,
}: QueryStoreItemsParams) => {
    const queryDocument = queryMap[query]
    // use no cache credential to include http only cookies
    if (!headers) {
        throw new Error("Headers are required")
    }
    return await createNoCacheCredentialAuthClientWithHeaders(headers).query<{
    storeItems: GraphQLResponse<StoreItemsResponse>
  }>({
      query: queryDocument,
      variables: {
          request,
      },
  })
}
