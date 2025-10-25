// define hermes client
import { HermesClient } from "@pythnetwork/hermes-client"
import type { Token } from "@ciwallet-sdk/types"

export const subscribeToPythUpdates = async (
    tokens: Array<Token>
) => {
    const connection = new HermesClient("https://hermes.pyth.network", {}) // See Hermes endpoints section below for other endpoints
    const pythIds: Array<string> = tokens.map((token) => token.pythId).filter((pythId) => !!pythId) as Array<string>
    const stream = await connection.getPriceUpdatesStream(pythIds)
    stream.addEventListener("message", (data) => {
        console.log(data)
    })
}
