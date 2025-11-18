import useSWR from "swr"

import type { UseSWR } from "../types"
import {
    queryStoreItems,
    QueryStoreItems,
    type StoreItemsResponse,
} from "@/nomas/modules/api"

export const useGetListStoreItems = (): UseSWR<StoreItemsResponse> => {
    const swr = useSWR<StoreItemsResponse>(async () => {
        const response = await queryStoreItems({
            query: QueryStoreItems.Query1,
            request: { id: "1" },
        })
        return response.data?.storeItems.data?.items
    })

    return { swr }
}
