import { gql } from "@apollo/client"
import type { DocumentNode } from "@apollo/client"
import type { GraphQLResponse, MutationParams } from "../types"
import { noCacheCredentialClient } from "../clients"

const mutation1 = gql`
    mutation VerifyMessage($input: VerifyMessageInput!) {
        verifyMessage(input: $input) {
            success
            message
            error
            data {
                accessToken
                refreshToken {
                    token
                    expiredAt
                }
            }
        }
    }
`

export enum MutationVerifyMessage {
    Mutation1 = "mutation1"
}

export enum Platform {
    Evm = "evm",
    Solana = "solana",
    Sui = "sui",
    Aptos = "aptos"
}

export interface VerifyMessageInput {
    message: string
    address: string
    signedMessage: string
    platform: "evm" | "solana" | "sui" | "aptos"
}

export interface VerifyMessageResponse {
    accessToken: string
    refreshToken: {
        token: string
        expiredAt: string | null
    }
}

const mutationMap: Record<MutationVerifyMessage, DocumentNode> = {
    [MutationVerifyMessage.Mutation1]: mutation1
}

export type MutationVerifyMessageParams = MutationParams<MutationVerifyMessage, VerifyMessageInput>

export const mutationVerifyMessage = async ({
    mutation = MutationVerifyMessage.Mutation1,
    request
}: MutationVerifyMessageParams) => {
    if (!request) {
        throw new Error("Request is required")
    }
    if (!request.message || !request.address || !request.signedMessage || !request.platform) {
        throw new Error("Message, address, signedMessage, and platform are required")
    }

    const mutationDocument = mutationMap[mutation]

    return await noCacheCredentialClient.mutate<{
        verifyMessage: GraphQLResponse<VerifyMessageResponse>
    }>({
        mutation: mutationDocument,
        variables: {
            input: request
        }
    })
}
