import useSWR from "swr"
import type { UseSWR } from "../../types"
import { queryRequestMessage, type RequestMessageResponse } from "@/nomas/modules/api"

export const useGraphQLQueryRequestMessage = (): UseSWR<RequestMessageResponse> => {
    const swr = useSWR<RequestMessageResponse>(
        "QUERY_REQUEST_MESSAGE",
        async () => {
            const response = await queryRequestMessage()
            const data = response?.data?.requestMessage?.data
            if (!data) {
                throw new Error("No request message data returned")
            }
            return data
        },
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }
    )

    return { swr }
}
