/* eslint-disable @typescript-eslint/ban-ts-comment */
// import { syncStorage } from "redux-persist-webextension-storage"
// @ts-ignore
import storage from "redux-persist-indexeddb-storage"

// export const syncStorageConfig = {
//     key: "syncStorage",
//     storage: syncStorage,
// }

export const indexeddbStorageConfig = {
    key: "indexeddbStorage",
    storage: storage("NomasDb"),
}

export const getStorageConfig = () => {
    return indexeddbStorageConfig
}