import { selectSelectedAccountByPlatform, useAppSelector } from "@/nomas/redux"
import useSWRMutation from "swr/mutation"
import { Platform } from "@ciwallet-sdk/types"
import { useContext } from "react"
import { SwrProviderContext } from "./SwrProvider"
import pRetry from "p-retry"
import { GraphQLContext } from "./graphql"
import { AuthDB } from "@/nomas/utils/idb"

export const useGameAuthenticationSwrMutationCore = () => {
    const evmAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, Platform.Evm))
    const graphqlContext = useContext(GraphQLContext)

    if (!graphqlContext) {
        throw new Error("GraphQLContext not found")
    }

    const { requestSignature, verifyMessage } = graphqlContext

    const swrMutation = useSWRMutation("GAME_AUTHENTICATION", async () => {
        await pRetry(
            async () => {
                if (!evmAccount) {
                    throw new Error("EVM account not found")
                }
                // request signature message from server
                const signatureData = await requestSignature.swrMutation.trigger({
                    platform: Platform.Evm
                })
                await verifyMessage.swrMutation.trigger({
                    request: {
                        message: signatureData.message.replaceAll("\\", ""),
                        address: signatureData.accountAddress,
                        signedMessage: signatureData.signature,
                        platform: Platform.Evm
                    }
                })
                Promise.all([
                    AuthDB.setAddressWallet(signatureData.accountAddress),
                    AuthDB.setMessage(signatureData.message.replaceAll("\\", "")),
                    AuthDB.setSignature(signatureData.signature),
                    AuthDB.setPublicKey(signatureData.publicKey)
                ])
                return true
            },
            {
                retries: 3
            }
        )
    })
    return swrMutation
}

export const useGameAuthenticationSwrMutation = () => {
    const context = useContext(SwrProviderContext)
    if (!context) {
        throw new Error("useGameAuthenticationSwr must be used within a SwrProvider")
    }
    return context.gameAuthenticationSwrMutation
}
