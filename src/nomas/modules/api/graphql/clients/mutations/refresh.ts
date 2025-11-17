import { type DocumentNode, gql } from "@apollo/client"
import { noCacheCredentialClient } from "../clients"
import type { GraphQLResponse, MutationParams } from "../../types"

const mutation1 = gql`
  mutation Refresh {
    refresh {
      success
      error
      message
      data {
        accessToken
        refreshToken
      }
    }
  }
`

export enum MutationRefresh {
  Mutation1 = "mutation1",
}

export interface MutationRefreshResponse {
  accessToken: string
}

const mutationMap: Record<MutationRefresh, DocumentNode> = {
    [MutationRefresh.Mutation1]: mutation1,
}

export type MutationRefreshParams = MutationParams<MutationRefresh>

export const mutationRefresh = async ({
    mutation = MutationRefresh.Mutation1,
}: MutationRefreshParams) => {
    const mutationDocument = mutationMap[mutation]
    // use no cache credential to include http only cookies
    return await noCacheCredentialClient.mutate<{
    refresh: GraphQLResponse<MutationRefreshResponse>
  }>({
      mutation: mutationDocument,
  })
}
