import { v4 } from "uuid"
import useSWRMutation from "swr/mutation"
import type { UseSWRMutation } from "../../types"
import { queryRequestSignature, type RequestSignatureInput, type RequestSignatureResponse } from "@/nomas/modules/api"

export type UseGraphQLMutationRequestSignatureArgs = RequestSignatureInput

export const useGraphQLMutationRequestSignature = (): UseSWRMutation<
    RequestSignatureResponse,
    UseGraphQLMutationRequestSignatureArgs
> => {
    const swrMutation = useSWRMutation(
        v4(),
        async (_: string, extraArgs: { arg: UseGraphQLMutationRequestSignatureArgs }) => {
            const params = { ...extraArgs.arg }
            const result = await queryRequestSignature({ request: params })
            const data = result.data?.requestSignature?.data

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
