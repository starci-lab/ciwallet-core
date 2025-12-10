import { v4 } from "uuid"
import useSWRMutation from "swr/mutation"
import type { UseSWRMutation } from "../../types"
import { mutationRequestMessageFn, type RequestMessageInput, type RequestMessageResponse } from "@/nomas/modules/api"

export type UseGraphQLMutationRequestMessageArgs = RequestMessageInput

export const useGraphQLMutationRequestMessage = (): UseSWRMutation<
    RequestMessageResponse,
    UseGraphQLMutationRequestMessageArgs
> => {
    const swrMutation = useSWRMutation(
        v4(),
        async (_: string, extraArgs: { arg: UseGraphQLMutationRequestMessageArgs }) => {
            const params = { ...extraArgs.arg }
            const result = await mutationRequestMessageFn({ request: params })
            const data = result.data?.requestMessage?.data

            if (!data) {
                throw new Error("No data returned from request signature")
            }

            return data
        }
    )

    return {
        swrMutation
    }
}
