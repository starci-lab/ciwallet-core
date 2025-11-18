import { createContext, type PropsWithChildren } from "react"
import { useGetListStoreItems } from "@/nomas/hooks/singleton/swr/graphql/useGetListStoreItems"
export interface GraphQLContextType {
  getListStoreItems: ReturnType<typeof useGetListStoreItems>
}

export const GraphQLContext = createContext<GraphQLContextType | null>(null)

export const GraphQLProvider = ({ children }: PropsWithChildren) => {
    const getListStoreItems = useGetListStoreItems()
    return (
        <GraphQLContext.Provider value={{ getListStoreItems }}>
            {children}
        </GraphQLContext.Provider>
    )
}
