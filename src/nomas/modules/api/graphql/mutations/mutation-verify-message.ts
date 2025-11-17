import { gql } from "@apollo/client"
import type { DocumentNode } from "@apollo/client"
import type { GraphQLResponse, MutationParams } from "../types"
import { noCacheCredentialClient } from "../clients"

const mutation1 = gql`
  mutation VerifyMessage($request: VerifyMessageRequest!) {
    verifyMessage(request: $request) {
      message
      success
      error
      data {
        accessToken
        refreshToken
        walletAddress
      }
    }
  }
`

export enum MutationVerifyMessage {
  Mutation1 = "mutation1",
}

export interface VerifyMessageRequest {
  message: string
  address: string
  signature: string
}

export interface VerifyMessageResponse {
  accessToken: string
  refreshToken: string
  walletAddress: string
}

const mutationMap: Record<MutationVerifyMessage, DocumentNode> = {
    [MutationVerifyMessage.Mutation1]: mutation1,
}

export type MutationVerifyMessageParams = MutationParams<
  MutationVerifyMessage,
  VerifyMessageRequest
>

export const mutationVerifyMessage = async ({
    mutation = MutationVerifyMessage.Mutation1,
    request,
}: MutationVerifyMessageParams) => {
    if (!request) {
        throw new Error("Request is required")
    }
    if (!request.message || !request.address || !request.signature) {
        throw new Error("Message, address, and signature are required")
    }

    const mutationDocument = mutationMap[mutation]
    // Use noCacheCredentialClient to include http-only cookies
    return await noCacheCredentialClient.mutate<{
    verifyMessage: GraphQLResponse<VerifyMessageResponse>
  }>({
      mutation: mutationDocument,
      variables: {
          request,
      },
  })
}
