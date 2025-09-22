import { useContext } from "react"
import { DisclosuresContext } from "./DiscloresureProvider"

export const useSelectTokenDisclosure = () => {
    const context = useContext(DisclosuresContext)
    if (!context) {
        throw new Error(
            "useSelectTokenDisclosure must be used within a DisclosureProvider"
        )
    }
    return context.useSelectTokenDisclosure
}