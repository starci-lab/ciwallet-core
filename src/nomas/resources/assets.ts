/* eslint-disable @typescript-eslint/no-require-imports */
let browser: typeof import("webextension-polyfill") | null = null

try {
    // Chỉ hoạt động khi có extension
    browser = require("webextension-polyfill")
} catch {
    browser = null
}

export const assetsConfig = () => {
    const isExtension = import.meta.env.VITE_APP_ENV === "EXTENSION"
    return {
        app: {
            logo: (isExtension ? browser?.runtime.getURL("/assets/app/logo.svg") : "/assets/app/logo.svg") ?? "",
            rocket: (isExtension ? browser?.runtime.getURL("/assets/app/rocket.svg") : "/assets/app/rocket.svg") ?? "",
            create: (isExtension ? browser?.runtime.getURL("/assets/app/create.svg") : "/assets/app/create.svg") ?? "",
            encrypt: (isExtension ? browser?.runtime.getURL("/assets/app/encrypt.svg") : "/assets/app/encrypt.svg") ?? "",
            done: (isExtension ? browser?.runtime.getURL("/assets/app/done.svg") : "/assets/app/done.svg") ?? "",
        }
    }
}