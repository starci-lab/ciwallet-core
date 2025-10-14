// import { envConfig } from "@/modules/configs/env"
import { ROUTES } from "@/nomas/constants/route"
import {
    setAccessTokenToLS,
    setAddressWalletToLS,
    setRefreshTokenToLS,
} from "@/nomas/utils/auth"
import type { AxiosError, AxiosInstance } from "axios"
import axios from "axios"

export class Http {
    instance: AxiosInstance
    accessToken: string
    refreshToken: string
    constructor() {
        this.accessToken = ""
        this.refreshToken = ""
        this.instance = axios.create({
            // baseURL: import.meta.env.VITE_BASE_URL,
            baseURL: " https://mate-desert-previous-rick.trycloudflare.com",
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
            (response) => {
                const { url } = response.config
                if (url === ROUTES.verify) {
                    const data = response.data
                    this.accessToken = data.access_token
                    this.refreshToken = data.refresh_token
                    setAddressWalletToLS(data.wallet_address)
                    setAccessTokenToLS(this.accessToken)
                    setRefreshTokenToLS(this.refreshToken)
                }
                return response
            },
            (error: AxiosError) => {
                return Promise.reject(error)
            }
        )
    }
}

const http = new Http().instance
export default http
