import { DocumentNode, gql } from "@apollo/client"
import { noCacheCredentialAuthClient } from "../clients"
import { GraphQLResponse, MutationParams } from "../types"
import { LiquidityPoolId } from "@/modules/types"

const mutation1 = gql`
  mutation UpdateLiquidityProvisionBotLiquidityPools($request: UpdateLiquidityProvisionBotLiquidityPoolsRequest!) {
    updateLiquidityProvisionBotLiquidityPools(request: $request) {
      message
      success
      error
    }
  }
`

export interface MutationUpdateLiquidityProvisionBotLiquidityPoolsRequest {
    liquidityPoolIds: Array<LiquidityPoolId>;
    id: string;
}

export enum MutationUpdateLiquidityProvisionBotLiquidityPools {
  Mutation1 = "mutation1",
}

const mutationMap: Record<MutationUpdateLiquidityProvisionBotLiquidityPools, DocumentNode> = {
    [MutationUpdateLiquidityProvisionBotLiquidityPools.Mutation1]: mutation1,
}

export type MutationUpdateLiquidityProvisionBotLiquidityPoolsParams = MutationParams<MutationUpdateLiquidityProvisionBotLiquidityPools, MutationUpdateLiquidityProvisionBotLiquidityPoolsRequest>;

export const mutationUpdateLiquidityProvisionBotLiquidityPools = async ({
    mutation = MutationUpdateLiquidityProvisionBotLiquidityPools.Mutation1,
    request,
}: MutationUpdateLiquidityProvisionBotLiquidityPoolsParams) => {
    const mutationDocument = mutationMap[mutation]
    // use no cache credential to include http only cookies
    return await noCacheCredentialAuthClient.mutate<{
        updateLiquidityProvisionBotLiquidityPools: GraphQLResponse,
    }>({
        mutation: mutationDocument,
        variables: {
            request
        },
    })
}
