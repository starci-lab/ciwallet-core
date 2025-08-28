import React, {
    type PropsWithChildren,
} from "react"
import { useDisclosure } from "@heroui/react"
import { DisclosuresContext } from "./core"

export const DisclosureProvider = ({ children }: PropsWithChildren) => {
    const selectToken = useDisclosure()

    return (
        <DisclosuresContext.Provider value={{ selectToken }}>
            {children}
        </DisclosuresContext.Provider>
    )
}

