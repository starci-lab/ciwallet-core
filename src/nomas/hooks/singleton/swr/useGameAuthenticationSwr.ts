import { selectSelectedAccountByPlatform, useAppSelector } from "@/nomas/redux"
import useSWR from "swr"
import { Platform } from "@ciwallet-sdk/types"
import http from "@/nomas/utils/http"
import { ROUTES } from "@/nomas/constants/route"
import { Wallet } from "ethers"
import { useContext } from "react"
import { SwrProviderContext } from "./SwrProvider"

export const useGameAuthenticationSwrCore = () => {
    // retrieve initialized from session slice
    const initialized = useAppSelector((state) => state.persists.session.initialized)
    // retrive evm address from session slice
    const evmAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, Platform.Evm))
    // all loaded
    const allLoaded = initialized && evmAccount
    const swr = useSWR(
        allLoaded ? 
            ["GAME_AUTHENTICATION", initialized, evmAccount] 
            : null, 
        async () => {
            if (!evmAccount) {
                throw new Error("EVM account not found")
            }
            const response = await http.post(ROUTES.getMessage)
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
            errorRetryCount: 3,
            shouldRetryOnError: true,
        })
    return swr
}

export const useGameAuthenticationSwr = () => {
    const context = useContext(SwrProviderContext)
    if (!context) {
        throw new Error(
            "useGameAuthenticationSwr must be used within a SwrProvider"
        )
    }
    return context.gameAuthenticationSwr
}
