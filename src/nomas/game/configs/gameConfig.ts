import { queryPets, queryStoreItems, type StoreItem, type Pet } from "@/nomas/modules"
import { getAssetUrlFromDisplayId } from "@/nomas/utils/assetPath"

export type FoodItem = StoreItem & {
    image_url: string
    cost_nom: number
    hungerRestore: number
    texture: string
    rarity: string
}

export type CleaningItem = StoreItem & {
    image_url: string
    cost_nom: number
    cleanlinessRestore: number
    texture: string
    rarity: string
}

export type ToyItem = StoreItem & {
    image_url: string
    cost_nom: number
    happinessRestore: number
    texture: string
    rarity: string
}

export type BackgroundItem = StoreItem & {
    image_url: string
    cost_nom: number
    texture: string
    rarity: string
}

export type FurnitureItem = StoreItem & {
    image_url: string
    cost_nom: number
    texture: string
    rarity: string
}

export type PetItem = Pet & {
    image_url: string
    cost_nom: number
    texture: string
    rarity: string
}

export interface GameConfig {
    food: {
        items: FoodItem[]
        defaultPrice: number
    }
    cleaning: {
        items: CleaningItem[]
        defaultPrice: number
    }
    toys: {
        items: ToyItem[]
        defaultPrice: number
    }
    pets: {
        items: PetItem[]
        defaultPrice: number
    }
    backgrounds: {
        items: BackgroundItem[]
        defaultPrice: number
    }
    furniture: {
        items: FurnitureItem[]
        defaultPrice: number
    }
    economy: {
        initialTokens: number
        hungerDecreaseRate: number
    }
    gameplay: {
        foodDespawnTime: number
        maxFoodInventory: number
        maxCleaningInventory: number
        maxToyInventory: number
    }
}

// Default local config (fallback)
export const DEFAULT_GAME_CONFIG: GameConfig = {
    food: {
        items: [],
        defaultPrice: 10
    },
    cleaning: {
        items: [],
        defaultPrice: 10
    },
    toys: {
        items: [],
        defaultPrice: 17
    },
    pets: {
        items: [],
        defaultPrice: 50
    },
    backgrounds: {
        items: [],
        defaultPrice: 30
    },
    furniture: {
        items: [],
        defaultPrice: 0
    },
    economy: {
        initialTokens: 100,
        hungerDecreaseRate: 2
    },
    gameplay: {
        foodDespawnTime: 20000,
        maxFoodInventory: 10,
        maxCleaningInventory: 5,
        maxToyInventory: 5
    }
}

class GameConfigManager {
    private config: GameConfig = DEFAULT_GAME_CONFIG
    private isLoaded = false

    async loadConfig(): Promise<GameConfig> {
        console.log("Starting loadConfig...")
        try {
            console.log("Calling GraphQL queries...")

            const [storeResponse, petResponse] = await Promise.all([queryStoreItems(), queryPets()])

            console.log("Store items response:", storeResponse.data)
            console.log("Pets response:", petResponse.data)

            const items = storeResponse.data?.gameStoreItems?.data ?? []
            const pets = petResponse.data?.gamePets?.data ?? []

            console.log("Items count:", items.length)
            console.log("Pets count:", pets.length)

            if (items.length === 0) {
                console.warn("No store items returned from API!")
            }

            if (pets.length === 0) {
                console.warn("No pets returned from API!")
            }

            const foodItems: FoodItem[] = items
                .filter((item) => item.type === "food")
                .map((item: StoreItem) => ({
                    ...item,
                    image_url: getAssetUrlFromDisplayId(item.displayId, "food"),
                    cost_nom: item.costNom,
                    hungerRestore: item.effectHunger ?? 15,
                    texture: item.displayId,
                    rarity: "common"
                }))

            const cleaningItems: CleaningItem[] = items
                .filter((item) => item.type === "clean")
                .map((item: StoreItem) => ({
                    ...item,
                    image_url: getAssetUrlFromDisplayId(item.displayId, "clean"),
                    cost_nom: item.costNom,
                    cleanlinessRestore: item.effectCleanliness ?? 15,
                    texture: item.displayId,
                    rarity: "common"
                }))

            const toyItems: ToyItem[] = items
                .filter((item) => item.type === "toy")
                .map((item: StoreItem) => ({
                    ...item,
                    image_url: getAssetUrlFromDisplayId(item.displayId, "toy"),
                    cost_nom: item.costNom,
                    happinessRestore: item.effectHappiness ?? 15,
                    texture: item.displayId,
                    rarity: "common"
                }))

            const backgroundItems: BackgroundItem[] = items
                .filter((item) => item.type === "background")
                .map((item: StoreItem) => ({
                    ...item,
                    image_url: getAssetUrlFromDisplayId(item.displayId, "background"),
                    cost_nom: item.costNom,
                    texture: item.displayId,
                    rarity: "common"
                }))

            const furnitureItems: FurnitureItem[] = items
                .filter((item) => item.type === "furniture")
                .map((item: StoreItem) => ({
                    ...item,
                    image_url: getAssetUrlFromDisplayId(item.displayId, "furniture"),
                    cost_nom: item.costNom,
                    texture: item.displayId,
                    rarity: "common"
                }))

            const petItems: PetItem[] = pets.map((pet: Pet) => ({
                ...pet,
                image_url: getAssetUrlFromDisplayId(pet.displayId, "pet"),
                cost_nom: pet.costNom,
                texture: pet.displayId,
                rarity: "common"
            }))

            const serverConfig: Partial<GameConfig> = {
                food: {
                    items: foodItems,
                    defaultPrice: foodItems[0]?.costNom || this.config.food.defaultPrice
                },
                cleaning: {
                    items: cleaningItems,
                    defaultPrice: cleaningItems[0]?.costNom || this.config.cleaning.defaultPrice
                },
                toys: {
                    items: toyItems,
                    defaultPrice: toyItems[0]?.costNom || this.config.toys.defaultPrice
                },
                backgrounds: {
                    items: backgroundItems,
                    defaultPrice: backgroundItems[0]?.costNom || this.config.backgrounds.defaultPrice
                },
                furniture: {
                    items: furnitureItems,
                    defaultPrice: furnitureItems[0]?.costNom || this.config.furniture.defaultPrice
                },
                pets: {
                    items: petItems,
                    defaultPrice: petItems[0]?.costNom || this.config.pets.defaultPrice
                }
            }

            console.log("Server config:", serverConfig)

            this.config = { ...DEFAULT_GAME_CONFIG, ...serverConfig }
            console.log("Game config loaded successfully!")
        } catch (error) {
            console.error("Error loading game config:", error)
            console.log("Using default game config")
        }

        this.isLoaded = true
        return this.config
    }

    getConfig(): GameConfig {
        return this.config
    }

    getFoodPrice(foodId: string = "hamburger"): number {
        const foodItem = this.config.food.items.find((item) => item.id === foodId)
        return foodItem?.costNom || this.config.food.defaultPrice
    }

    getFoodItem(foodId: string): FoodItem | undefined {
        return this.config.food.items.find((item) => item.id === foodId)
    }

    getCleaningPrice(cleaningId: string = "brush"): number {
        const cleaningItem = this.config.cleaning.items.find((item) => item.id === cleaningId)
        return cleaningItem?.costNom || this.config.cleaning.defaultPrice
    }

    getCleaningItem(cleaningId: string): CleaningItem | undefined {
        return this.config.cleaning.items.find((item) => item.id === cleaningId)
    }

    getToyPrice(toyId: string = "ball"): number {
        const toyItem = this.config.toys.items.find((item) => item.id === toyId)
        return toyItem?.costNom || this.config.toys.defaultPrice
    }

    getToyItem(toyId: string): ToyItem | undefined {
        return this.config.toys.items.find((item) => item.id === toyId)
    }

    getPetPrice(petId: string = "chog"): number {
        const petItem = this.config.pets.items.find((item) => item.id === petId)
        return petItem?.costNom || this.config.pets.defaultPrice
    }

    getPetItem(petId: string): PetItem | undefined {
        return this.config.pets.items.find((item) => item.id === petId)
    }

    getPetItems(): { [key: string]: PetItem } {
        const petItems: { [key: string]: PetItem } = {}
        this.config.pets.items.forEach((item) => {
            petItems[item.displayId] = item
        })
        return petItems
    }

    getBackgroundPrice(backgroundId: string = "forest"): number {
        const backgroundItem = this.config.backgrounds.items.find((item) => item.id === backgroundId)
        return backgroundItem?.cost_nom || this.config.backgrounds.defaultPrice
    }

    getBackgroundItem(backgroundId: string): BackgroundItem | undefined {
        return this.config.backgrounds.items.find((item) => item.id === backgroundId)
    }

    getBackgroundItems(): { [key: string]: BackgroundItem } {
        const backgroundItems: { [key: string]: BackgroundItem } = {}
        this.config.backgrounds.items.forEach((item) => {
            backgroundItems[item.displayId] = item
        })
        return backgroundItems
    }

    getToyItems(): { [key: string]: ToyItem } {
        const toyItems: { [key: string]: ToyItem } = {}
        this.config.toys.items.forEach((item) => {
            toyItems[item.displayId] = item
        })
        return toyItems
    }

    getFoodItems(): { [key: string]: FoodItem } {
        const foodItems: { [key: string]: FoodItem } = {}
        this.config.food.items.forEach((item) => {
            foodItems[item.displayId] = item
        })
        return foodItems
    }

    getCleaningItems(): { [key: string]: CleaningItem } {
        const cleaningItems: { [key: string]: CleaningItem } = {}
        this.config.cleaning.items.forEach((item) => {
            cleaningItems[item.displayId] = item
        })
        return cleaningItems
    }

    getFurnitureItems(): { [key: string]: FurnitureItem } {
        const furnitureItems: { [key: string]: FurnitureItem } = {}
        this.config.furniture.items.forEach((item) => {
            furnitureItems[item.displayId] = item
        })
        return furnitureItems
    }

    updateConfig(newConfig: Partial<GameConfig>) {
        this.config = { ...this.config, ...newConfig }
    }

    isConfigLoaded(): boolean {
        return this.isLoaded
    }

    // Debug method to log current food items
    logFoodItems(): void {
        console.log("Current Food Items Configuration:")
        console.log("================================")
        this.config.food.items.forEach((item, index) => {
            console.log(`${index + 1}. ${item.name}`)
            console.log(`   ID: ${item.id}`)
            console.log(`   Price: ${item.cost_nom} tokens`)
            console.log(`   Hunger Restore: ${item.hungerRestore}`)
            console.log(`   Texture: ${item.texture}`)
            console.log(`   Rarity: ${item.rarity || "common"}`)
            console.log("   ---")
        })
        console.log(`Total items: ${this.config.food.items.length}`)
        console.log(`Default price: ${this.config.food.defaultPrice}`)
        console.log(`Config loaded: ${this.isLoaded}`)
        console.log("================================")
    }
}

export const gameConfigManager = new GameConfigManager()
