import { gql, type DocumentNode } from "@apollo/client"
import type { GraphQLResponse, MutationParams } from "../types"
import { noCacheCredentialClient } from "../clients"
import type { Platform } from "packages"

const mutationRequestMessage = gql`
    mutation RequestMessage($input: RequestMessageInput!) {
        requestMessage(input: $input) {
            success
            message
            error
            data {
                message
            }
        }
    }
`

export enum MutationRequestMessage {
    MutationRequestMessage = "mutationRequestMessage"
}

export interface RequestMessageInput {
    platform: Platform
}

export interface RequestMessageResponse {
    message: string
}

const mutationMap: Record<MutationRequestMessage, DocumentNode> = {
    [MutationRequestMessage.MutationRequestMessage]: mutationRequestMessage
}

export type MutationRequestMessageParams = MutationParams<MutationRequestMessage, RequestMessageInput>

export const mutationRequestMessageFn = async ({
    mutation = MutationRequestMessage.MutationRequestMessage,
    request
}: MutationRequestMessageParams) => {
    if (!request) {
        throw new Error("Request is required")
    }
    if (!request.platform) {
        throw new Error("Platform is required")
    }

    const mutationDocument = mutationMap[mutation]

    return await noCacheCredentialClient.mutate<{
        requestMessage: GraphQLResponse<RequestMessageResponse>
    }>({
        mutation: mutationDocument,
        variables: {
            input: request
        }
    })
}
