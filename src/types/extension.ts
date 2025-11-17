export enum ExtensionMessageType {
    ToggleOverlay = "toggle-overlay"
}

export interface ExtensionMessage<TData = undefined> {
    type: ExtensionMessageType
    data?: TData
}

export interface ExtensionMessageResponse<TData = undefined> {
    success: boolean
    data?: TData
}

export enum ContentEvent {
    ToggleOverlay = "content:toggle-overlay"
}