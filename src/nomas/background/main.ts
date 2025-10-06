import browser from "webextension-polyfill"
import { BackgroundMessageType, type ExtensionMessage } from "../content/messages/types"
// Listener để nhận message gửi từ content script hoặc popup
browser.runtime.onMessage.addListener((
    message: unknown,
    _: browser.Runtime.MessageSender,
    sendResponse: (response: unknown) => void
) => {
    console.log("[Nomas] Background received message:", message)
    const _message = message as ExtensionMessage
    switch (_message.type) {
    // Ví dụ sau này có thể thêm case xử lý khác:
    // case BackgroundMessageType.PING:
    //   sendResponse({ success: true })
    //   break

    default:
        sendResponse({
            success: false,
            error: `Unknown message type: ${_message.type}`
        })
        break
    }

    // Trả về true để giữ kênh phản hồi mở nếu cần trả async
    return true
})

/**
 * Gửi message TOGGLE_OVERLAY xuống content script ở tab hiện tại.
 * Khi user click icon extension → gọi hàm này để toggle overlay UI.
 */
const toggleOverlayVisible = (tab: browser.Tabs.Tab): void => {
    if (tab.id) {
    // Gửi message xuống content script của tab hiện tại
        browser.tabs.sendMessage(tab.id, {
            type: BackgroundMessageType.TOGGLE_OVERLAY
        }).catch((error) => {
            console.warn("[Nomas] Error sending toggle message to tab:", error)
        })
    } else {
    // Fallback: gửi broadcast message
        browser.runtime.sendMessage({
            type: BackgroundMessageType.TOGGLE_OVERLAY
        }).catch((error) => {
            console.warn("[Nomas] Error broadcasting toggle message:", error)
        })
    }
}

/**
 * Gắn listener khi user click vào icon extension trên toolbar
 * → gọi toggleOverlayVisible() cho tab hiện tại
 */
browser.action.onClicked.addListener((tab: browser.Tabs.Tab) => {
    console.log("[Nomas] Extension icon clicked")
    toggleOverlayVisible(tab)
})