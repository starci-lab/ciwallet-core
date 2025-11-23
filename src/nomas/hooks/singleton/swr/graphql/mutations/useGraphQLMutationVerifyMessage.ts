import { v4 } from "uuid"
import useSWRMutation from "swr/mutation"

import type { UseSWRMutation } from "../../types"

import {
    mutationVerifyMessage,
    type MutationVerifyMessageParams,
    type VerifyMessageResponse,
} from "@/nomas/modules/api"

export type UseGraphQLMutationVerifyMessageMutationArgs =
  MutationVerifyMessageParams

export const useGraphQLMutationVerifyMessageSwrMutation = (): UseSWRMutation<
  VerifyMessageResponse,
  UseGraphQLMutationVerifyMessageMutationArgs
> => {
    const swrMutation = useSWRMutation(
        v4(),
        async (
            _: string,
            extraArgs: { arg: UseGraphQLMutationVerifyMessageMutationArgs }
        ) => {
            const params = { ...extraArgs.arg }
            const result = await mutationVerifyMessage(params)
            const verifyMessageResult = result.data?.verifyMessage?.data

            if (!verifyMessageResult) {
                throw new Error("No data returned from verify message mutation")
            }

            return verifyMessageResult
        }
    )

    return {
        swrMutation,
    }
}
