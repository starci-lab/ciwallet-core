import superjson from "../superjson"

// session storage interface to manage session storage
export class SessionStorage {
    setItem<T>(key: SessionStorageKey, value: T) {
        sessionStorage.setItem(key, superjson.stringify(value))
    }
    getItem<T>(key: SessionStorageKey) {
        const item = sessionStorage.getItem(key)
        if (!item) {
            return null
        }
        return superjson.parse<T>(item)
    }
    removeItem(key: SessionStorageKey) {
        sessionStorage.removeItem(key)
    }
}

export enum SessionStorageKey {
    AccessToken = "accessToken",
    TemporaryAccessToken = "temporaryAccessToken",
}