import axios, { type AxiosInstance } from "axios"
import axiosRetry from "axios-retry"
import { Network, Platform } from "@ciwallet-sdk/types"
import {
    verifyDepositAddressSignatures,
    TESTNET_GUARDIAN_NODES,
    MAINNET_GUARDIAN_NODES,
    type VerificationResult
} from "./guardian"
import type { HyperliquidChainId } from "./types"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"

export interface GenerateAddressParams {
    sourceChain: HyperliquidChainId
    destinationChain: HyperliquidChainId
    asset: string
    destinationAddress: string
    network: Network
}

export interface GenerateAddressResponse {
    address: string
    verification: VerificationResult
}

export class Hyperunit {
    private readonly axiosInstances: Record<Network, AxiosInstance>

    constructor() {
        this.axiosInstances = {
            [Network.Mainnet]: axios.create({ baseURL: "https://api.hyperunit.xyz" }),
            [Network.Testnet]: axios.create({ baseURL: "https://api.hyperunit-testnet.xyz" }),
        }

        Object.values(this.axiosInstances).forEach((instance) => {
            axiosRetry(instance, { retries: 3, retryDelay: (count) => count * 1000 })
        })
    }

    private getAxios(network: Network) {
        return this.axiosInstances[network]
    }

    private getPlatform(chainId: HyperliquidChainId) {
        if (chainId === "hyperliquid") {
            return "hyperliquid"
        }
        const platform: Platform = chainIdToPlatform(chainId)
        switch (platform) {
        case Platform.Evm:
            return "ethereum"
        case Platform.Solana:
            return "solana"
        case Platform.Sui:
            return "sui"
        case Platform.Aptos:
            return "aptos"
        default:
            throw new Error(`Invalid chain id: ${chainId}`)
        }
    }
    
    async generateAddress(
        {
            sourceChain,
            destinationChain,
            asset,
            destinationAddress,
            network,
        }: GenerateAddressParams,
    ): Promise<GenerateAddressResponse> {
        const { data } = await this.getAxios(network).get(
            `/gen/${this.getPlatform(sourceChain)}/${this.getPlatform(destinationChain)}/${asset}/${destinationAddress}`
        )
        const { proposal, signatures } = data
        const GUARDIAN_NODES = network === Network.Mainnet ? MAINNET_GUARDIAN_NODES : TESTNET_GUARDIAN_NODES
        const result = await verifyDepositAddressSignatures(signatures, proposal, GUARDIAN_NODES)
        if (!result.success) {
            throw new Error(`Guardian verification failed: ${JSON.stringify(result.errors)}`)
        }
        return { 
            address: proposal.address, 
            verification: result 
        }
    }
}

export interface DepositParams {
    address: string
    amount: number
    network: Network
}

export interface DepositResponse {
    transactionHash: string
}