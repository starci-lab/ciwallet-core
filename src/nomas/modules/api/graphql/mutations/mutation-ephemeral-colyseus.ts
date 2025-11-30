import { gql, type DocumentNode } from "@apollo/client"
import type { GraphQLResponse, MutationParams } from "../types"
import { noCacheCredentialClient } from "../clients"

const mutationEphemeralColyseus = gql`
    mutation RequestColyseusEphemeralJwt($input: RequestColyseusEphemeralJwtInput!) {
        requestColyseusEphemeralJwt(input: $input) {
            success
            message
            error
            data {
                jwt
            }
        }
    }
`

export enum MutationEphemeralColyseus {
    MutationEphemeralColyseus = "mutationEphemeralColyseus"
}

export interface RequestColyseusEphemeralJwtInput {
    publicKey: string
    accountAddress: string
    signature: string
    message: string
    platform: "evm" | "solana" | "sui" | "aptos"
}

export interface RequestColyseusEphemeralJwtResponse {
    jwt: string
}

const mutationMap: Record<MutationEphemeralColyseus, DocumentNode> = {
    [MutationEphemeralColyseus.MutationEphemeralColyseus]: mutationEphemeralColyseus
}

export type MutationEphemeralColyseusParams = MutationParams<
    MutationEphemeralColyseus,
    RequestColyseusEphemeralJwtInput
>

export const mutationEphemeralColyseusFn = async ({
    mutation = MutationEphemeralColyseus.MutationEphemeralColyseus,
    request
}: MutationEphemeralColyseusParams) => {
    if (!request) {
        throw new Error("Request is required")
    }
    if (!request.publicKey || !request.accountAddress || !request.signature || !request.message || !request.platform) {
        throw new Error("Public key, account address, signature, message, and platform are required")
    }

    const mutationDocument = mutationMap[mutation]

    return await noCacheCredentialClient.mutate<{
        requestColyseusEphemeralJwt: GraphQLResponse<RequestColyseusEphemeralJwtResponse>
    }>({
        mutation: mutationDocument,
        variables: {
            input: request
        }
    })
}
