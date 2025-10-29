import { useContext } from "react"
import { ColyseusContext } from "./ColyseusProvider"

export const useColyseusFeed = () => {
    const context = useContext(ColyseusContext)
    if (!context) {
        throw new Error("Colyseus client not found")
    }
    return context.useColyseus
}