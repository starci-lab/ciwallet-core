import { gql } from "@apollo/client"
import type { DocumentNode } from "@apollo/client"
import { noCacheClient } from "../clients"
import type { GraphQLResponse, QueryParams } from "../types"

const query1 = gql`
  query GetMessage {
    getMessage {
      message
      success
      error
      data {
        message
      }
    }
  }
`

export enum QueryGetMessage {
  Query1 = "query1",
}

export interface GetMessageResponse {
  message: string
}

const queryMap: Record<QueryGetMessage, DocumentNode> = {
    [QueryGetMessage.Query1]: query1,
}

export type QueryGetMessageParams = QueryParams<QueryGetMessage>

export const queryGetMessage = async ({
    query = QueryGetMessage.Query1,
}: QueryGetMessageParams = {}) => {
    const queryDocument = queryMap[query]
    // Use noCacheClient because this doesn't require authentication
    return await noCacheClient.query<{
    getMessage: GraphQLResponse<GetMessageResponse>
  }>({
      query: queryDocument,
  })
}
