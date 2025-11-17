import { ContentEvent } from "@/types"
import { useEffect } from "react"
import { EventEmitter } from "eventemitter3"
import { setIsOverlayVisible } from "@/nomas/redux"
import { useAppDispatch, useAppSelector } from "@/nomas/redux/hooks"
export const useIconClickContentBus = (contentEventBus?: EventEmitter) => {
    const _contentEventBus = contentEventBus || new EventEmitter()
    const dispatch = useAppDispatch()
    const isOverlayVisible = useAppSelector((state) => state.persists.session.isOverlayVisible)

    useEffect(() => {
        const handleToggleOverlay = () => {
            console.log("Toggle overlay")
            dispatch(setIsOverlayVisible(!isOverlayVisible))
        }
        _contentEventBus.on(ContentEvent.ToggleOverlay, handleToggleOverlay)
        return () => {
            _contentEventBus.off(ContentEvent.ToggleOverlay, handleToggleOverlay)
        }
    }, [isOverlayVisible, dispatch])
    return _contentEventBus
}