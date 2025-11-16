import { UserSchema } from "@/modules/types"
import { noCacheAuthClient, noCacheAuthClientWithoutRetry } from "../clients"
import { GraphQLResponse, QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"

const query1 = gql`
  query User {
    user {
      message
      success
      error
      data {
        email
        encryptedTotpSecret
        temporaryTotpToken
        oauthProvider
        oauthProviderId
        picture
        referralCode
      }
    }
  }
`

export enum QueryUser {
  Query1 = "query1",
}

const queryMap: Record<QueryUser, DocumentNode> = {
    [QueryUser.Query1]: query1,
}

export type QueryUserParams = QueryParams<QueryUser, UserSchema>;

export const queryUser = async (
    { query = QueryUser.Query1 }: QueryUserParams,
    withRetry = true
) => {
    const queryDocument = queryMap[query]
    // use no cache credential to include http only cookies
    const client = withRetry ? noCacheAuthClientWithoutRetry : noCacheAuthClient
    return await client.query<{ user: GraphQLResponse<UserSchema> }>({
        query: queryDocument,
    })
}
