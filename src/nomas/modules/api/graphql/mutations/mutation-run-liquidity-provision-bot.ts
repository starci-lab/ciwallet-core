import { DocumentNode, gql } from "@apollo/client"
import { noCacheCredentialAuthClient } from "../clients"
import { GraphQLResponse, MutationParams } from "../types"

const mutation1 = gql`
  mutation RunLiquidityProvisionBot($request: RunLiquidityProvisionBotRequest!) {
    runLiquidityProvisionBot(request: $request) {
      message
      success
      error
    }
  }
`

export interface MutationRunLiquidityProvisionBotRequest {
  id: string;
}

export enum MutationRunLiquidityProvisionBot {
  Mutation1 = "mutation1",
}

const mutationMap: Record<MutationRunLiquidityProvisionBot, DocumentNode> = {
    [MutationRunLiquidityProvisionBot.Mutation1]: mutation1,
}

export type MutationRunLiquidityProvisionBotParams = MutationParams<MutationRunLiquidityProvisionBot, MutationRunLiquidityProvisionBotRequest>;

export const mutationRunLiquidityProvisionBot = async ({
    mutation = MutationRunLiquidityProvisionBot.Mutation1,
    request,
}: MutationRunLiquidityProvisionBotParams) => {
    const mutationDocument = mutationMap[mutation]
    // use no cache credential to include http only cookies
    return await noCacheCredentialAuthClient.mutate<{
        runLiquidityProvisionBot: GraphQLResponse,
    }>({
        mutation: mutationDocument,
        variables: {
            request
        },
    })
}
