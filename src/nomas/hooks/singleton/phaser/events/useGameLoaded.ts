import { ReactEventName } from "@/nomas/game"
import { reactBus } from "@/nomas/game/events/react/bus"
import { useEffect } from "react"
import { setGameLoaded, useAppDispatch } from "@/nomas/redux"

export const useGameLoaded = () => {
    const dispatch = useAppDispatch()
    useEffect(() => {
        const handleGameLoaded = () => {
            dispatch(setGameLoaded(true))
        }
        reactBus.on(ReactEventName.GameLoaded, handleGameLoaded)
        return () => {
            reactBus.off(ReactEventName.GameLoaded, handleGameLoaded)
        }
    }, [])
    
}