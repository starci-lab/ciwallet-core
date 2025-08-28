import { createContext, useContext } from "react"
import { useDisclosure } from "@heroui/react"

export interface DisclosuresContextType {
    selectToken: ReturnType<typeof useDisclosure>;
  }
  
export const DisclosuresContext = createContext<DisclosuresContextType | undefined>(
    undefined
)


export const useSelectTokenDisclosure = () => {
    const context = useContext(DisclosuresContext)
    if (!context) {
        throw new Error(
            "useSelectTokenDisclosure must be used within a DisclosureProvider"
        )
    }
    return context.selectToken
}