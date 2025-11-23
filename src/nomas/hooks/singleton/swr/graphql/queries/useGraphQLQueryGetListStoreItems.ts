import useSWR from "swr"

import type { UseSWR } from "../../types"
import {
    queryStoreItems,
    StoreItemsQueries,
    type StoreItemsResponse,
} from "@/nomas/modules/api"

export const useGraphQLQueryGetListStoreItems =
  (): UseSWR<StoreItemsResponse> => {
      const swr = useSWR<StoreItemsResponse>(async () => {
          const response = await queryStoreItems({
              query: StoreItemsQueries.Query1,
              headers: {},
              request: { id: "1" },
          })
          return response.data?.storeItems.data?.items
      })

      return { swr }
  }
