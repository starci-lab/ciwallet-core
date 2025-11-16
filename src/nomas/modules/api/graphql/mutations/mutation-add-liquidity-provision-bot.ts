import { DocumentNode, gql } from "@apollo/client"
import { noCacheCredentialAuthClient } from "../clients"
import { GraphQLResponse, MutationParams } from "../types"
import { ChainId } from "@/modules/types"

const mutation1 = gql`
  mutation AddLiquidityProvisionBot($request: AddLiquidityProvisionBotRequest!) {
    addLiquidityProvisionBot(request: $request) {
      message
      success
      error
      data {
        id
        accountAddress
      }
    }
  }
`

export interface MutationAddLiquidityProvisionBotRequest {
    chainId: ChainId;
}

export enum MutationAddLiquidityProvisionBot {
  Mutation1 = "mutation1",
}

export interface MutationAddLiquidityProvisionBotResponse {
  id: string;
  accountAddress: string;
}

const mutationMap: Record<MutationAddLiquidityProvisionBot, DocumentNode> = {
    [MutationAddLiquidityProvisionBot.Mutation1]: mutation1,
}

export type MutationAddLiquidityProvisionBotParams = MutationParams<MutationAddLiquidityProvisionBot, MutationAddLiquidityProvisionBotRequest>;

export const mutationAddLiquidityProvisionBot = async ({
    mutation = MutationAddLiquidityProvisionBot.Mutation1,
    request,
}: MutationAddLiquidityProvisionBotParams) => {
    const mutationDocument = mutationMap[mutation]
    // use no cache credential to include http only cookies
    return await noCacheCredentialAuthClient.mutate<{
        addLiquidityProvisionBot: GraphQLResponse<MutationAddLiquidityProvisionBotResponse>,
    }>({
        mutation: mutationDocument,
        variables: {
            request
        },
    })
}
