import { Network } from "@ciwallet-sdk/types"
import axios from "axios"
import axiosRetry from "axios-retry"

export const HYPERUNIT_ENDPOINT_TESTNET = "https://api.hyperunit-testnet.xyz"
export const HYPERUNIT_ENDPOINT_MAINNET = "https://api.hyperunit.xyz/"

export const getHyperunitEndpoint = (network: Network) => {
    switch (network) {
    case Network.Mainnet:
        return HYPERUNIT_ENDPOINT_MAINNET
    case Network.Testnet:
        return HYPERUNIT_ENDPOINT_TESTNET
    default:
        throw new Error(`Invalid network: ${network}`)
    }
}

export const getHyperunitAxiosInstance = (network: Network) => {
    switch (network) {
    case Network.Mainnet: {
        const axiosInstance = axios.create({
            baseURL: HYPERUNIT_ENDPOINT_MAINNET,
        })
        axiosRetry(axiosInstance, {
            retries: 3,
            retryDelay: (retryCount) => {
                return retryCount * 1000
            },
        })
        return axiosInstance
    }
    case Network.Testnet: {
        const axiosInstance = axios.create({
            baseURL: HYPERUNIT_ENDPOINT_TESTNET,
        })
        axiosRetry(axiosInstance, {
            retries: 3,
            retryDelay: (retryCount) => {
                return retryCount * 1000
            },
        })
        return axiosInstance
    }
    default:
        throw new Error(`Invalid network: ${network}`)
    }
}   