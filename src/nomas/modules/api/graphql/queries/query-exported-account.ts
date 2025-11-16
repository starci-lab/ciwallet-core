import { createNoCacheCredentialAuthClientWithHeaders } from "../clients"
import { GraphQLResponse, QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"

const query1 = gql`
  query ExportedAccount($request: ExportedAccountRequest!) {
    exportedAccount(request: $request) {
      message
      success
      error
      data {
        accountAddress
        privateKey
      }
    }
  }
`

export interface ExportedAccountResponse {
  accountAddress: string;
  privateKey: string;
}

export enum QueryExportedAccount {
  Query1 = "query1",
}

export interface ExportedAccountRequest {
  id: string;
}

const queryMap: Record<QueryExportedAccount, DocumentNode> = {
    [QueryExportedAccount.Query1]: query1,
}

export type QueryExportedAccountParams = QueryParams<
  QueryExportedAccount,
  ExportedAccountRequest
>;

export const queryExportedAccount = async (
    { query = QueryExportedAccount.Query1, request, headers }: QueryExportedAccountParams,
) => {
    const queryDocument = queryMap[query]
    // use no cache credential to include http only cookies
    if (!headers) {
        throw new Error("Headers are required")
    }
    return await createNoCacheCredentialAuthClientWithHeaders(headers).query<{
        exportedAccount: GraphQLResponse<ExportedAccountResponse>;
  }>({
      query: queryDocument,
      variables: {
          request,
      },
  })
}
