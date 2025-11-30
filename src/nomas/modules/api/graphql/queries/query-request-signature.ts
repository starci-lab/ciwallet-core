import { gql } from "@apollo/client"
import type { DocumentNode } from "@apollo/client"
import type { GraphQLResponse, QueryParams } from "../types"
import { noCacheClient } from "../clients"

const query1 = gql`
    mutation RequestSignature($input: RequestSignatureInput!) {
        requestSignature(input: $input) {
            success
            message
            data {
                signature
                message
                publicKey
                accountAddress
            }
        }
    }
`

export enum QueryRequestSignature {
    Query1 = "query1"
}

export interface RequestSignatureInput {
    platform: "evm" | "solana" | "sui" | "aptos"
}

export interface RequestSignatureResponse {
    signature: string
    message: string // Message cần ký (JSON string với nonce)
    publicKey: string
    accountAddress: string
}

const queryMap: Record<QueryRequestSignature, DocumentNode> = {
    [QueryRequestSignature.Query1]: query1
}

export type QueryRequestSignatureParams = QueryParams<QueryRequestSignature, RequestSignatureInput>

export const queryRequestSignature = async ({
    query = QueryRequestSignature.Query1,
    request
}: QueryRequestSignatureParams) => {
    if (!request) {
        throw new Error("Request is required")
    }
    if (!request.platform) {
        throw new Error("Platform is required")
    }

    const queryDocument = queryMap[query]

    return await noCacheClient.mutate<{
        requestSignature: GraphQLResponse<RequestSignatureResponse>
    }>({
        mutation: queryDocument,
        variables: {
            input: request
        }
    })
}
