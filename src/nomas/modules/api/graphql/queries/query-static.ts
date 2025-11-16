import { DocumentNode, gql } from "@apollo/client"
import { GraphQLResponse, QueryParams } from "../types"
import { LiquidityPoolSchema, TokenSchema, DexSchema, ConfigSchema } from "@/modules/types"
import { client } from "../clients"

const query1 = gql`
  query Static {
    tokens {
        success
        message
        error
        data {
            id
            createdAt
            updatedAt
            displayId
            name
            symbol
            decimals
            tokenAddress
            coinMarketCapId
            coinGeckoId
            iconUrl
            chainId
            projectUrl
            network
            cexIds
            whichCex
            cexSymbols
            type
            pythFeedId
        }
    }
    liquidityPools {
        success
        message
        error
        data {
            id
            createdAt
            updatedAt
            displayId
            poolAddress
            fee
            network
            chainId
            dex
            tokenA
            tokenB
            rewardTokens
        }
    }
    dexes {
        success
        message
        error
        data {
            id
            createdAt
            updatedAt
            displayId
            name
            description
            website
            iconUrl
        }
    }    
    gasConfig {
        success
        message
        error
        data {
            minGasRequired
        }
    }
}`

export enum QueryStatic {
    Query1 = "query1",
  }
  
const queryMap: Record<QueryStatic, DocumentNode> = {
    [QueryStatic.Query1]: query1,
}
  
export interface QueryStaticResponse {
    tokens: GraphQLResponse<Array<TokenSchema>>
    liquidityPools: GraphQLResponse<Array<LiquidityPoolSchema>>
    dexes: GraphQLResponse<Array<DexSchema>>
    gasConfig: GraphQLResponse<ConfigSchema>
}

export type QueryStaticParams = QueryParams<QueryStatic, QueryStaticResponse>;
  
export const queryStatic = async (
    { query = QueryStatic.Query1 }: QueryStaticParams,
) => {
    const queryDocument = queryMap[query]
    // use original cache client to avoid query cache
    return await client.query<QueryStaticResponse>({
        query: queryDocument,
    })
}
  