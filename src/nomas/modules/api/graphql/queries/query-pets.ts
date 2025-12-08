import { gql } from "@apollo/client"
import { authClient } from "../clients"
import type { GraphQLResponse } from "../types"

export enum QueryPets {
    GetPets = "GetPets"
}

export const PetsQueries = {
    [QueryPets.GetPets]: gql`
        query GetPets {
            gamePets {
                success
                message
                data {
                    displayId
                    name
                    description
                    defaultHappiness
                    defaultHunger
                    defaultCleanliness
                    happinessDecayMin
                    happinessDecayMax
                    hungerDecayMin
                    hungerDecayMax
                    cleanlinessDecayMin
                    cleanlinessDecayMax
                    costNom
                    timeNatural
                    maxIncome
                    incomePerClaim
                    maxIncomePerClaim
                    createdAt
                    updatedAt
                }
            }
        }
    `
} as const

export interface Pet {
    id: string
    displayId: string
    name: string
    description?: string
    defaultHappiness: number
    defaultHunger: number
    defaultCleanliness: number
    happinessDecayMin: number
    happinessDecayMax: number
    hungerDecayMin: number
    hungerDecayMax: number
    cleanlinessDecayMin: number
    cleanlinessDecayMax: number
    costNom: number
    timeNatural: number
    maxIncome: number
    incomePerClaim: number
    maxIncomePerClaim: number
    createdAt: string
    updatedAt: string
}

export type QueryPetsParams = {
    query?: QueryPets
}

export const queryPets = async ({ query = QueryPets.GetPets }: QueryPetsParams = {}) => {
    const queryDocument = PetsQueries[query]
    return await authClient.query<{
        gamePets: GraphQLResponse<Pet[]>
    }>({ query: queryDocument, fetchPolicy: "no-cache" })
}
