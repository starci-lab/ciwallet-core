// background/onClickHandler.ts
import { ExtensionMessageType, type ExtensionMessage, type ExtensionMessageResponse } from "@/types"
import * as browser from "webextension-polyfill"

export const onIconClickHandler = () => {
    browser.action.onClicked.addListener(async (tab) => {
        if (!tab.id) return
        try {
            const response = await browser.tabs.sendMessage<ExtensionMessage>(
                tab.id, 
                { 
                    type: ExtensionMessageType.ToggleOverlay 
                })
            const _response = response as ExtensionMessageResponse
            if (_response.success) {
                console.log("Overlay toggled successfully")
            } else {
                console.warn("Failed to toggle overlay")
            }
        } catch (err) {
            console.warn("Failed to send message to tab:", err)
        }
    })
}