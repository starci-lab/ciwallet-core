import { contentEventBus } from "../bus"
import { ContentEvent } from "@/types"

export const onIconClickHandler = () => {
    contentEventBus.emit(ContentEvent.ToggleOverlay)
}