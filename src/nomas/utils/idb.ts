import { openDB } from "idb"

const db = await openDB("nomas-db", 1, {
    upgrade(database) {
        database.createObjectStore("auth")
        database.createObjectStore("pets")
    },
})

export const AuthDB = {
    setAccessToken: async (accessToken: string) => {
        return await db.put("auth", accessToken, "access_token")
    },
    getAccessToken: async (): Promise<string> => {
        return (await db.get("auth", "access_token")) || ""
    },
    setRefreshToken: async (refreshToken: string) => {
        return await db.put("auth", refreshToken, "refresh_token")
    },
    getRefreshToken: async (): Promise<string> => {
        return (await db.get("auth", "refresh_token")) || ""
    },
    setAddressWallet: async (addressWallet: string) => {
        return await db.put("auth", addressWallet, "address_wallet")
    },
    getAddressWallet: async (): Promise<string> => {
        return (await db.get("auth", "address_wallet")) || ""
    },
    clear: async () => {
        await db.delete("auth", "access_token")
        await db.delete("auth", "refresh_token")
        await db.delete("auth", "address_wallet")
    },
}

export const PetsDB = {
    setPoopCount: async (petId: string, poopCount: number) => {
        return await db.put("pets", poopCount,"poop_count_"+ petId)
    },
    getPoopCount: async (petId: string): Promise<number> => {
        return (await db.get("pets", "poop_count_" + petId)) || 0
    },
    setPoopTime: async (petId: string, poopTime: number) => {
        return await db.put("pets", poopTime, "poop_time_" + petId)
    },
    clearPoopCount: async (petId: string) => {
        await db.delete("pets", "poop_count_" + petId)
    },
}