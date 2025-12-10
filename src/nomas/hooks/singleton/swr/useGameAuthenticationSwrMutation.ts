import { selectSelectedAccountByPlatform, useAppSelector } from "@/nomas/redux"
import useSWRMutation from "swr/mutation"
import { Platform } from "@ciwallet-sdk/types"
import { useContext } from "react"
import { SwrProviderContext } from "./SwrProvider"
import pRetry from "p-retry"
import { AuthDB } from "@/nomas/utils/idb"
import { useGraphQL } from "@/nomas/hooks/singleton/swr/graphql"
import { EvmProvider } from "@ciwallet-sdk/classes"

export const useGameAuthenticationSwrMutationCore = () => {
    const evmAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, Platform.Evm))
    const chainId = useAppSelector((state) => state.persists.session.chainId)
    const network = useAppSelector((state) => state.persists.session.network)
    const rpcs = useAppSelector((state) => state.persists.session.rpcs[chainId][network])

    const { requestMessage, verifyMessage } = useGraphQL()

    const swrMutation = useSWRMutation("GAME_AUTHENTICATION", async () => {
        await pRetry(
            async () => {
                if (!evmAccount) {
                    throw new Error("EVM account not found")
                }

                const messageResult = await requestMessage.swrMutation.trigger({
                    platform: Platform.Evm
                })

                const evmProvider = new EvmProvider({
                    chainId: chainId,
                    network: network,
                    privateKey: evmAccount?.privateKey,
                    rpcs: rpcs
                })
                const signature = await evmProvider.signMessage(messageResult.message)

                if (!signature) {
                    throw new Error("Signature is required")
                }

                const cleanedMessage = messageResult.message.replaceAll("\\", "")
                if (!cleanedMessage) {
                    throw new Error("Cleaned message is empty")
                }

                await verifyMessage.swrMutation.trigger({
                    request: {
                        message: cleanedMessage,
                        address: evmAccount.accountAddress,
                        signedMessage: signature,
                        platform: Platform.Evm
                    }
                })

                await Promise.all([
                    AuthDB.setAddressWallet(evmAccount.accountAddress),
                    AuthDB.setMessage(messageResult.message),
                    AuthDB.setSignature(signature),
                    AuthDB.setPublicKey(evmAccount.accountAddress)
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
