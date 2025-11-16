import { DocumentNode, gql } from "@apollo/client"
import { GraphQLResponse, GraphQLHeadersKey, MutationParams } from "../types"
import { createNoCacheCredentialAuthClientWithHeaders } from "../clients"

const mutation1 = gql`
  mutation ConfirmTotp {
    confirmTotp {
      message
      success
      error
      data {
        accessToken
      }
    }
  }
`

export enum MutationConfirmTotp {
  Mutation1 = "mutation1",
}

export interface MutationConfirmTotpResponse {
  accessToken: string;
}

const mutationMap: Record<MutationConfirmTotp, DocumentNode> = {
    [MutationConfirmTotp.Mutation1]: mutation1,
}

export type MutationConfirmTotpParams = MutationParams<MutationConfirmTotp>;

export const mutationConfirmTotp = async ({
    mutation = MutationConfirmTotp.Mutation1,
    headers,
}: MutationConfirmTotpParams) => {
    const mutationDocument = mutationMap[mutation]
    // add to headers
    // use no cache credential to include http only cookies
    if (!headers) {
        throw new Error("Headers are required")
    }
    if (!headers[GraphQLHeadersKey.TOTP]) {
        throw new Error("TOTP is required")
    }
    return await createNoCacheCredentialAuthClientWithHeaders(headers).mutate<{
    confirmTotp: GraphQLResponse<MutationConfirmTotpResponse>,
  }>({
      mutation: mutationDocument,
  })
}
