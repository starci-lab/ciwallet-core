import type { GraphQLResponse } from "@/nomas/modules/api/graphql/types"
import { authClient } from "../clients"
import { gql } from "@apollo/client"

export enum QueryRequestMessage {
    RequestMessage = "RequestMessage"
}

export const RequestMessageQueries = {
    [QueryRequestMessage.RequestMessage]: gql`
        query RequestMessage {
            requestMessage {
                message
                success
                error
                data {
                    message
                }
            }
        }
    `
} as const

export interface RequestMessageResponse {
    message: string
}

export const queryRequestMessage = async () => {
    const queryDocument = RequestMessageQueries[QueryRequestMessage.RequestMessage]

    return await authClient.query<{
        requestMessage: GraphQLResponse<RequestMessageResponse>
    }>({
        query: queryDocument,
        fetchPolicy: "no-cache"
    })
}
