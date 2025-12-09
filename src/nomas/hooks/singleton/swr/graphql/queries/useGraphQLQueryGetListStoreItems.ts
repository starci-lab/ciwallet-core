import useSWR from "swr"

import type { UseSWR } from "../../types"
import { queryStoreItems, type StoreItem } from "@/nomas/modules/api"

export const useGraphQLQueryGetListStoreItems = (): UseSWR<StoreItem[]> => {
    const swr = useSWR<StoreItem[]>(
        "QUERY_STORE_ITEMS",
        async () => {
            const response = await queryStoreItems()
            const data = response?.data?.gameStoreItems?.data
            if (!data) {
                throw new Error("No store items data returned")
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
