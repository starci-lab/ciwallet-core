import { DocumentNode, gql } from "@apollo/client"
import { noCacheCredentialAuthClient } from "../clients"
import { GraphQLResponse, MutationParams } from "../types"
import { ExplorerId } from "@/modules/blockchain"

const mutation1 = gql`
  mutation UpdateLiquidityProvisionBotExplorerId($request: UpdateLiquidityProvisionBotExplorerIdRequest!) {
    updateLiquidityProvisionBotExplorerId(request: $request) {
      message
      success
      error
    }
  }
`

export interface MutationUpdateLiquidityProvisionBotExplorerIdRequest {
    explorerId: ExplorerId;
    id: string;
}

export enum MutationUpdateLiquidityProvisionBotExplorerId {
  Mutation1 = "mutation1",
}

const mutationMap: Record<MutationUpdateLiquidityProvisionBotExplorerId, DocumentNode> = {
    [MutationUpdateLiquidityProvisionBotExplorerId.Mutation1]: mutation1,
}

export type MutationUpdateLiquidityProvisionBotExplorerIdParams = MutationParams<MutationUpdateLiquidityProvisionBotExplorerId, MutationUpdateLiquidityProvisionBotExplorerIdRequest>;

export const mutationUpdateLiquidityProvisionBotExplorerId = async ({
    mutation = MutationUpdateLiquidityProvisionBotExplorerId.Mutation1,
    request,
}: MutationUpdateLiquidityProvisionBotExplorerIdParams) => {
    const mutationDocument = mutationMap[mutation]
    // use no cache credential to include http only cookies
    return await noCacheCredentialAuthClient.mutate<{
        updateLiquidityProvisionBotExplorerId: GraphQLResponse,
    }>({
        mutation: mutationDocument,
        variables: {
            request
        },
    })
}
