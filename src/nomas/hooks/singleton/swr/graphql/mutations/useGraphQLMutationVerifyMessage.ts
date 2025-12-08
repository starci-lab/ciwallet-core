import { v4 } from "uuid"
import useSWRMutation from "swr/mutation"

import type { UseSWRMutation } from "../../types"

import {
    mutationVerifyMessage,
    type MutationVerifyMessageParams,
    type VerifyMessageResponse
} from "@/nomas/modules/api"
import { AuthDB } from "@/nomas/utils/idb"

export type UseGraphQLMutationVerifyMessageMutationArgs = MutationVerifyMessageParams

export const useGraphQLMutationVerifyMessageSwrMutation = (): UseSWRMutation<
    VerifyMessageResponse,
    UseGraphQLMutationVerifyMessageMutationArgs
> => {
    const swrMutation = useSWRMutation(
        v4(),
        async (_: string, extraArgs: { arg: UseGraphQLMutationVerifyMessageMutationArgs }) => {
            const params = { ...extraArgs.arg }
            const result = await mutationVerifyMessage(params)
            const verifyMessageResult = result.data?.verifyMessage?.data

            if (!verifyMessageResult) {
                throw new Error("No data returned from verify message mutation")
            }

            // save access token and refresh token to idb
            await Promise.all([
                AuthDB.setAccessToken(verifyMessageResult.accessToken),
                AuthDB.setRefreshToken(verifyMessageResult.refreshToken.token)
            ])

            return verifyMessageResult
        }
    )

    return {
        swrMutation
    }
}
