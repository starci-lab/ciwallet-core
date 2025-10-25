// import { envConfig } from "@/modules/configs/env"
import { ROUTES } from "@/nomas/constants/route"
import type { AxiosError, AxiosInstance } from "axios"
import axios from "axios"
import { AuthDB } from "./idb"

export class Http {
    instance: AxiosInstance
    accessToken: string
    refreshToken: string
    constructor() {
        this.accessToken = ""
        this.refreshToken = ""
        const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:3001"
        console.log("🌐 HTTP Client Base URL:", baseURL)
        this.instance = axios.create({
            baseURL: baseURL,
            // baseURL: " https://mate-desert-previous-rick.trycloudflare.com",
            timeout: 10000,
            headers: {
                "Content-Type": "application/json",
            },
        })

        this.instance.interceptors.request.use(
            (config) => {
                return config
            },
            (error) => {
                return Promise.reject(error)
            }
        )

        // Add a response interceptor
        this.instance.interceptors.response.use(
            async (response) => {
                const { url } = response.config
                if (url === ROUTES.verify) {
                    const data = response.data
                    this.accessToken = data.access_token
                    this.refreshToken = data.refresh_token
                    await Promise.all([
                        AuthDB.setAddressWallet(data.wallet_address),
                        AuthDB.setAccessToken(this.accessToken),
                        AuthDB.setRefreshToken(this.refreshToken),
                    ])
                }
                return response
            },
            (error: AxiosError) => {
                console.error("❌ HTTP error:", error)
                return Promise.reject(error)
            }
        )
    }
}

const http = new Http().instance
export default http
