import type { IStorageAdapter, KeyedItem } from "./IStorageAdapter"

export const defaultStorageAdapter: IStorageAdapter = {
    find: async <T>(collection: string, id: string) => {
        return JSON.parse(localStorage.getItem(`${collection}-${id}`) || "{}") as KeyedItem<T> | undefined
    },
    findAll: async <T>(collection: string, filter?: (item: T) => boolean) => {
        return JSON.parse(localStorage.getItem(`${collection}-${filter}`) || "[]") as Array<KeyedItem<T>>
    },
    create: async <T>(collection: string, data: KeyedItem<T>) => {
        return JSON.parse(localStorage.getItem(`${collection}-${data.id}`) || "{}") as KeyedItem<T>
    },
    createMany: async <T>(collection: string, data: Array<KeyedItem<T>>) => {
        return JSON.parse(localStorage.getItem(`${collection}-${data.map(item => item.id).join(",")}`) || "[]") as Array<KeyedItem<T>>
    },
    put: async <T>(collection: string, id: string, data: Partial<KeyedItem<T>>) => {
        throw new Error("Not implemented")
    },
    delete: async (collection: string, id: string) => {
        return JSON.parse(localStorage.getItem(`${collection}-${id}`) || "{}") as boolean
    },
    clear: async (collection: string) => {
        return JSON.parse(localStorage.getItem(`${collection}`) || "[]")
    }
}