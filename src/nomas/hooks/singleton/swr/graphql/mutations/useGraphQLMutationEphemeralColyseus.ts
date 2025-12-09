import {
    mutationEphemeralColyseusFn,
    type MutationEphemeralColyseusParams,
    type RequestColyseusEphemeralJwtResponse
} from "@/nomas/modules/api"
import type { UseSWRMutation } from "../../types"
import { v4 } from "uuid"
import useSWRMutation from "swr/mutation"

export type UseGraphQLMutationEphemeralColyseusMutationArgs = MutationEphemeralColyseusParams

export const useGraphQLMutationEphemeralColyseusSwrMutation = (): UseSWRMutation<
    RequestColyseusEphemeralJwtResponse,
    UseGraphQLMutationEphemeralColyseusMutationArgs
> => {
    const swrMutation = useSWRMutation(
        v4(),
        async (_: string, extraArgs: { arg: UseGraphQLMutationEphemeralColyseusMutationArgs }) => {
            const params = { ...extraArgs.arg }
            const result = await mutationEphemeralColyseusFn(params)
            const requestColyseusEphemeralJwtResult = result.data?.requestColyseusEphemeralJwt?.data
            if (!requestColyseusEphemeralJwtResult) {
                throw new Error("No data returned from request colyseus ephemeral jwt")
            }
            return requestColyseusEphemeralJwtResult
        }
    )

    return {
        swrMutation
    }
}
