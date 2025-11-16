import { LiquidityProvisionBotSchema } from "@/modules/types"
import { noCacheAuthClient } from "../clients"
import { GraphQLResponse, QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"

const query1 = gql`
  query LiquidityProvisionBot($request: LiquidityProvisionBotRequest!) {
    liquidityProvisionBot(request: $request) {
      success
      message
      error
      data {
        accountAddress
        id
        createdAt
        updatedAt
        encryptedPrivateKey
        chainId
        user
        name
        priorityToken
        liquidityPools
        initialized
        explorerId
        rpcUrls
        running
        lastRunAt
        stoppedAt
      }
    }
  }
`

export enum QueryLiquidityProvisionBot {
  Query1 = "query1",
}

const queryMap: Record<QueryLiquidityProvisionBot, DocumentNode> = {
    [QueryLiquidityProvisionBot.Query1]: query1,
}

export interface QueryLiquidityProvisionBotRequest {
    id: string;
}

export type QueryLiquidityProvisionBotParams = QueryParams<
  QueryLiquidityProvisionBot,
  QueryLiquidityProvisionBotRequest
>;

export const queryLiquidityProvisionBot = async (
    {
        query = QueryLiquidityProvisionBot.Query1,
        request
    }: QueryLiquidityProvisionBotParams
) => {
    const queryDocument = queryMap[query]
    // use no cache credential to include http only cookies
    return await noCacheAuthClient.query<{ liquidityProvisionBot: GraphQLResponse<LiquidityProvisionBotSchema> }>({
        query: queryDocument,
        variables: {
            request
        }
    })
}
