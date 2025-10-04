// src/interfaces/storage-adapter.interface.ts
import { StorageCollection } from "./enum"

/**
 * A generic interface that defines how data actions
 * (CRUD operations) should be performed on a storage layer.
 *
 * Each adapter corresponds to a logical "table" or collection.
 */
export type KeyedItem<T> = T & { id: string }

export interface IStorageAdapter {
    /**
     * Find a single record by its primary key (id).
     */
    find<T>(collection: StorageCollection, id: string): Promise<KeyedItem<T> | undefined>

    /**
     * Find all records that match the optional filter function.
     * If no filter is provided, returns all records.
     */
    findAll<T>(collection: StorageCollection, filter?: (item: T) => boolean): Promise<Array<KeyedItem<T>>>

    /**
     * Create a new record in the table.
     * Should throw if record already exists.
     */
    create<T>(collection: StorageCollection, data: T): Promise<KeyedItem<T>>

    /**
     * Create multiple records in the table.
     */
    createMany<T>(collection: StorageCollection, data: Array<T>): Promise<Array<KeyedItem<T>>>

    /**
     * Create or update a record (upsert).
     */
    put<T>(collection: StorageCollection, id: string, data: Partial<T>): Promise<KeyedItem<T>>

    /**
     * Delete a record by its primary key.
     * Returns true if deleted, false if not found.
     */
    delete(collection: StorageCollection, id: string): Promise<boolean>

    /**
     * Clear all records in the table.
     */
    clear(collection: StorageCollection): Promise<void>
}