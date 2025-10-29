import { selectSelectedAccountByPlatform, useAppSelector } from "@/nomas/redux"
import useSWRMutation from "swr/mutation"
import { Platform } from "@ciwallet-sdk/types"
import http from "@/nomas/utils/http"
import { ROUTES } from "@/nomas/constants/route"
import { Wallet } from "ethers"
import { useContext } from "react"
import { SwrProviderContext } from "./SwrProvider"
import pRetry from "p-retry"

export const useGameAuthenticationSwrMutationCore = () => {
    const evmAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, Platform.Evm))
    const swrMutation = useSWRMutation(
        "GAME_AUTHENTICATION",
        async () => {
            await pRetry(async () => {
                if (!evmAccount) {
                    throw new Error("EVM account not found")
                }
                const response = await http.get(ROUTES.getMessage)
                const messageToSign = response.data.message
                const wallet = new Wallet(evmAccount.privateKey)
                const signedMessage = await wallet.signMessage(messageToSign || "")
                await http.post(ROUTES.verify, {
                    message: messageToSign,
                    address: evmAccount.accountAddress,
                    signature: signedMessage,
                })
                return true
            }, {
                retries: 3,
            })
        })
    return swrMutation
}

export const useGameAuthenticationSwrMutation = () => {
    const context = useContext(SwrProviderContext)
    if (!context) {
        throw new Error(
            "useGameAuthenticationSwr must be used within a SwrProvider"
        )
    }
    return context.gameAuthenticationSwrMutation
}
