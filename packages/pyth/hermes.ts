// define hermes client
import { HermesClient, type PriceUpdate } from "@pythnetwork/hermes-client"
import type { Token, TokenId, UnifiedToken, UnifiedTokenId } from "@ciwallet-sdk/types"
import { computeDenomination } from "@ciwallet-sdk/utils"
import BN from "bn.js"

export const subscribeToPythUpdates = async (
    tokens: Array<Token>,
    onUpdate?: (tokenId: TokenId, price: number) => void
) => {
    const pythIds: Array<string> = [...new Set(tokens.map((token) => token.pythId).filter((pythId) => !!pythId) as Array<string>)]
    // split pythIds into chunks of 5
    const chunks = pythIds.reduce((acc, pythId, index) => {
        const chunkIndex = Math.floor(index / 5)
        if (!acc[chunkIndex]) {
            acc[chunkIndex] = []
        }
        acc[chunkIndex].push(pythId)
        return acc
    }, [] as Array<Array<string>>)
    console.log("chunks", chunks)
    for (const chunk of chunks) {
        const connection = new HermesClient("https://hermes.pyth.network", {}) // See Hermes endpoints section below for other endpoints
        const stream = await connection.getPriceUpdatesStream(chunk)
        stream.addEventListener("message", (data: MessageEvent<string>) => {
            const update: PriceUpdate = JSON.parse(data.data)
            for (const price of update.parsed ?? []) {
                const pythId =  pythIds.find((pythId) => pythId.includes(price.id))
                if (!pythId) throw new Error(`Pyth ID not found for ${price.id}`)
                for (const token of tokens) {
                    if (!token.pythId || token.pythId !== pythId) continue
                    if (price.ema_price.expo === 0) continue
                    const tokenPrice = computeDenomination(new BN(price.ema_price.price), -price.ema_price.expo, 10)
                    onUpdate?.(token.tokenId, tokenPrice.toNumber())
                }
            }
        })
    }
}

export const subscribeToUnifiedPythUpdates = async (
    unifiedTokens: Array<UnifiedToken>,
    onUpdate?: (unifiedTokenId: UnifiedTokenId, price: number) => void
) => {
    const connection = new HermesClient("https://hermes.pyth.network", {}) // See Hermes endpoints section below for other endpoints
    const pythIds: Array<string> = unifiedTokens.map((unifiedToken) => unifiedToken.pythId).filter((pythId) => !!pythId) as Array<string>
    const stream = await connection.getPriceUpdatesStream(pythIds)
    stream.addEventListener("message", (data: MessageEvent<string>) => {
        const update: PriceUpdate = JSON.parse(data.data)
        for (const price of update.parsed ?? []) {
            const pythId =  pythIds.find((pythId) => pythId.includes(price.id))
            if (!pythId) throw new Error(`Pyth ID not found for ${price.id}`)
            const unifiedToken = unifiedTokens.find((unifiedToken) => unifiedToken.pythId === pythId)
            if (!unifiedToken) throw new Error(`Unified token not found for ${pythId}`)
            if (price.ema_price.expo === 0) continue
            const unifiedTokenPrice = computeDenomination(new BN(price.ema_price.price), -price.ema_price.expo)
            onUpdate?.(unifiedToken.unifiedTokenId, unifiedTokenPrice.toNumber())
        }
    })
}