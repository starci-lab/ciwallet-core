/* eslint-disable @typescript-eslint/ban-ts-comment */
import { syncStorage } from "redux-persist-webextension-storage"
// @ts-ignore
import storage from "redux-persist-indexeddb-storage"

export const syncStorageConfig = {
    key: "syncStorage",
    storage: syncStorage,
}

export const indexeddbStorageConfig = {
    key: "indexeddbStorage",
    storage: storage("NomasDb"),
}

export const getStorageConfig = () => {
    // Read environment variable injected by Vite
    const appEnv = import.meta.env.VITE_APP_ENV
    console.log("[Env Check]", import.meta.env.MODE, import.meta.env.VITE_APP_ENV)
    if (appEnv === "EXTENSION") {
        // If we are building for browser extension
        return syncStorageConfig
        //return indexeddbStorageConfig // demo fallback
    } else {
        // Default: Web environment
        return indexeddbStorageConfig
    }
}