import { DocumentNode, gql } from "@apollo/client"
import { noCacheCredentialAuthClient } from "../clients"
import { GraphQLResponse, MutationParams } from "../types"

const mutation1 = gql`
  mutation StopLiquidityProvisionBot($request: StopLiquidityProvisionBotRequest!) {
    stopLiquidityProvisionBot(request: $request) {
      message
      success
      error
    }
  }
`

export interface MutationStopLiquidityProvisionBotRequest {
    id: string;
}

export enum MutationStopLiquidityProvisionBot {
  Mutation1 = "mutation1",
}

const mutationMap: Record<MutationStopLiquidityProvisionBot, DocumentNode> = {
    [MutationStopLiquidityProvisionBot.Mutation1]: mutation1,
}

export type MutationStopLiquidityProvisionBotParams = MutationParams<MutationStopLiquidityProvisionBot, MutationStopLiquidityProvisionBotRequest>;

export const mutationStopLiquidityProvisionBot = async ({
    mutation = MutationStopLiquidityProvisionBot.Mutation1,
    request,
}: MutationStopLiquidityProvisionBotParams) => {
    const mutationDocument = mutationMap[mutation]
    // use no cache credential to include http only cookies
    return await noCacheCredentialAuthClient.mutate<{
        stopLiquidityProvisionBot: GraphQLResponse,
    }>({
        mutation: mutationDocument,
        variables: {
            request
        },
    })
}
