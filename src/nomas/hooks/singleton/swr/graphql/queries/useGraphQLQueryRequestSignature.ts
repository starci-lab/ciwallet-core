import useSWRMutation from "swr/mutation"
import type { UseSWRMutation } from "../../types"
import type {
    RequestSignatureInput,
    RequestSignatureResponse
} from "@/nomas/modules/api/graphql/queries/query-request-signature"
import { queryRequestSignature } from "@/nomas/modules/api/graphql/queries/query-request-signature"

export type UseGraphQLQueryRequestSignatureArgs = RequestSignatureInput

export const useGraphQLQueryRequestSignature = (): UseSWRMutation<
    RequestSignatureResponse,
    UseGraphQLQueryRequestSignatureArgs
> => {
    const swrMutation = useSWRMutation(
        "REQUEST_SIGNATURE",
        async (_: string, extraArgs: { arg: UseGraphQLQueryRequestSignatureArgs }) => {
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
