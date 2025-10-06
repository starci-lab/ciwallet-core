export enum BackgroundMessageType {
    TOGGLE_OVERLAY = "TOGGLE_OVERLAY"
}

export interface ExtensionMessage {
    type: BackgroundMessageType
}
