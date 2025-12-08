import useSWR from "swr"

import type { UseSWR } from "../../types"
import { queryPets, type Pet } from "@/nomas/modules/api"

export const useGraphQLQueryGetListPets = (): UseSWR<Pet[]> => {
    const swr = useSWR<Pet[]>(
        "GET_PETS_LIST",
        async () => {
            const response = await queryPets()
            const data = response?.data?.gamePets?.data
            if (!data) {
                throw new Error("No pets data returned")
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
