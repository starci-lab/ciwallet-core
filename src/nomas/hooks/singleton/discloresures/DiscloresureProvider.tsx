import React, {
    createContext,
    type PropsWithChildren,
} from "react"
import { useDisclosure } from "@heroui/react"

export interface DisclosuresContextType {
    useSelectTokenDisclosure: ReturnType<typeof useDisclosure>;
}
  
export const DisclosuresContext = createContext<DisclosuresContextType | undefined>(
    undefined
)

export const DisclosureProvider = ({ children }: PropsWithChildren) => {
    const useSelectTokenDisclosure = useDisclosure()

    return (
        <DisclosuresContext.Provider value={{ useSelectTokenDisclosure }}>
            {children}
        </DisclosuresContext.Provider>
    )
}

