import { DocumentNode, gql } from "@apollo/client"
import { noCacheCredentialAuthClient } from "../clients"
import { GraphQLResponse, MutationParams } from "../types"

const mutation1 = gql`
  mutation UpdateLiquidityProvisionBotRpcs($request: UpdateLiquidityProvisionBotRpcsRequest!) {
    updateLiquidityProvisionBotRpcs(request: $request) {
      message
      success
      error
    }
  }
`

export interface MutationUpdateLiquidityProvisionBotRpcsRequest {
    rpcUrls: Array<string>;
    id: string;
}

export enum MutationUpdateLiquidityProvisionBotRpcs {
  Mutation1 = "mutation1",
}

const mutationMap: Record<MutationUpdateLiquidityProvisionBotRpcs, DocumentNode> = {
    [MutationUpdateLiquidityProvisionBotRpcs.Mutation1]: mutation1,
}

export type MutationUpdateLiquidityProvisionBotRpcsParams = MutationParams<MutationUpdateLiquidityProvisionBotRpcs, MutationUpdateLiquidityProvisionBotRpcsRequest>;

export const mutationUpdateLiquidityProvisionBotRpcs = async ({
    mutation = MutationUpdateLiquidityProvisionBotRpcs.Mutation1,
    request,
}: MutationUpdateLiquidityProvisionBotRpcsParams) => {
    const mutationDocument = mutationMap[mutation]
    // use no cache credential to include http only cookies
    return await noCacheCredentialAuthClient.mutate<{
        updateLiquidityProvisionBotRpcs: GraphQLResponse,
    }>({
        mutation: mutationDocument,
        variables: {
            request
        },
    })
}
