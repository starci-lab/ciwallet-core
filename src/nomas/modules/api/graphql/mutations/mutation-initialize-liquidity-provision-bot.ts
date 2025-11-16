import { DocumentNode, gql } from "@apollo/client"
import { noCacheCredentialAuthClient } from "../clients"
import { GraphQLResponse, MutationParams } from "../types"
import { TokenId } from "@/modules/types"
import { LiquidityPoolId } from "@/modules/types"

const mutation1 = gql`
  mutation InitializeLiquidityProvisionBot($request: InitializeLiquidityProvisionBotRequest!) {
    initializeLiquidityProvisionBot(request: $request) {
      message
      success
      error
    }
  }
`

export interface MutationInitializeLiquidityProvisionBotRequest {
    id: string;
    name: string;
    priorityTokenId: TokenId;
    liquidityPoolIds: Array<LiquidityPoolId>;
}

export enum MutationInitializeLiquidityProvisionBot {
  Mutation1 = "mutation1",
}

const mutationMap: Record<MutationInitializeLiquidityProvisionBot, DocumentNode> = {
    [MutationInitializeLiquidityProvisionBot.Mutation1]: mutation1,
}

export type MutationInitializeLiquidityProvisionBotParams = MutationParams<MutationInitializeLiquidityProvisionBot, MutationInitializeLiquidityProvisionBotRequest>;

export const mutationInitializeLiquidityProvisionBot = async ({
    mutation = MutationInitializeLiquidityProvisionBot.Mutation1,
    request,
}: MutationInitializeLiquidityProvisionBotParams) => {
    const mutationDocument = mutationMap[mutation]
    // use no cache credential to include http only cookies
    return await noCacheCredentialAuthClient.mutate<{
        initializeLiquidityProvisionBot: GraphQLResponse,
    }>({
        mutation: mutationDocument,
        variables: {
            request
        },
    })
}
