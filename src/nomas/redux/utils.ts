/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { syncStorage } from "redux-persist-webextension-storage"
// @ts-ignore
import storage from "redux-persist-indexeddb-storage"
import type { PersistConfig } from "redux-persist"

export const syncStorageConfig = {
    key: "syncStorage",
    storage: syncStorage,
}

export const indexeddbStorageConfig = {
    key: "indexeddbStorage",
    storage: storage("NomasDb"),
}

export const getStorageConfig = <S = any>(config?: Partial<PersistConfig<S>>): PersistConfig<S> => {
    const appEnv = import.meta.env.VITE_APP_ENV
    console.log("[Env Check]", import.meta.env.MODE, import.meta.env.VITE_APP_ENV)
  
    const baseConfig = appEnv === "EXTENSION" ? syncStorageConfig : indexeddbStorageConfig
  
    // Merge extra config (like blacklist/whitelist)
    return {
        ...baseConfig,
        ...config,
    }
}