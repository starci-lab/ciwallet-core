import { HyperliquidDepositAsset } from "./types"
import { Hyperliquid } from "./Hyperliquid"
import { ChainId, Network, Platform } from "@ciwallet-sdk/types"
import { EvmProvider, SolanaProvider } from "../providers"
import Decimal from "decimal.js"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"
import { TokenManager } from "../data"

export class HyperliquidDeposit {
    private readonly hyperliquid: Hyperliquid
    private readonly tokenManager: TokenManager
    constructor() {
        this.hyperliquid = new Hyperliquid()
        this.tokenManager = new TokenManager()
    }

    private async depositArbitrum(
        { 
            asset, 
            chainId, 
            amount, 
            privateKey,
            network,
            rpcs,
        }: DepositParams,
    ): Promise<DepositResponse> {
        const hyperliquidAsset = this.hyperliquid.getDepositAssetInfoByAsset(asset)
        if (!hyperliquidAsset.refs.some((ref) => ref.chainId === chainId)) {
            throw new Error(`Chain ${chainId} is not supported for asset ${asset}`)
        }
        const ref = hyperliquidAsset.refs.find((ref) => ref.chainId === chainId)
        if (!ref) {
            throw new Error(`Ref not found for chain ${chainId}`)
        }
        const token = this.tokenManager.getTokenById(ref.tokenId)
        if (!token) {
            throw new Error(`Token not found for chain ${chainId}`)
        }
        const BRIDGE2_CONTRACT = "0x2df1c51e09aecf9cacb7bc98cb1742757f163df7"
        if (network === Network.Testnet) {
            throw new Error("Testnet is not supported for deposit")
        }
        if (!token.address) {
            throw new Error(`Token address not found for chain ${chainId}`)
        }
        if (new Decimal(amount).lt(5)) {
            throw new Error("Amount must be greater than 5")
        }
        const evmProvider = new EvmProvider({
            chainId,
            network,
            privateKey,
            rpcs,
        })
        const tx = await evmProvider.transfer({
            tokenAddress: token.address,
            toAddress: BRIDGE2_CONTRACT,
            amount,
            decimals: token.decimals,
        })
        return { txHash: tx.txHash }
    }

    private async depositOther(
        { 
            asset, 
            chainId, 
            amount, 
            privateKey,
            network,
            rpcs,
            generatedAddress,
        }: DepositParams,
    ): Promise<DepositResponse> {
        const hyperliquidAsset = this.hyperliquid.getDepositAssetInfoByAsset(asset)
        if (!hyperliquidAsset.refs.some((ref) => ref.chainId === chainId)) {
            throw new Error(`Chain ${chainId} is not supported for asset ${asset}`)
        }
        const ref = hyperliquidAsset.refs.find((ref) => ref.chainId === chainId)
        if (!ref) {
            throw new Error(`Ref not found for chain ${chainId}`)
        }
        const token = this.tokenManager.getTokenById(ref.tokenId)
        if (!token) {
            throw new Error(`Token not found for chain ${chainId}`)
        }
        if (!token.address) {
            throw new Error(`Token address not found for chain ${chainId}`)
        }
        const platform = chainIdToPlatform(chainId)
        if (!platform) {
            throw new Error(`Platform not found for chain ${chainId}`)
        }
        switch (platform) {
        case Platform.Evm:
        {
            if (!generatedAddress) {
                throw new Error("Generated address is required for deposit")
            }
            const evmProvider = new EvmProvider({
                chainId,
                network,
                privateKey,
                rpcs,
            })
            const tx = await evmProvider.transfer({
                tokenAddress: token.address,
                toAddress: generatedAddress,
                amount,
                decimals: token.decimals,
            })
            return { txHash: tx.txHash }
        }
        case Platform.Solana:
        {
            if (!generatedAddress) {
                throw new Error("Generated address is required for deposit")
            }
            const solanaProvider = new SolanaProvider({
                chainId,
                network,
                privateKey,
                rpcs,
            })
            const tx = await solanaProvider.transfer({
                tokenAddress: token.address,
                toAddress: generatedAddress,
                amount,
                decimals: token.decimals,
                isToken2022: false,
            })
            return { txHash: tx.txHash }
        }
        default:
            throw new Error(`Platform ${platform} is not supported for deposit`)
        }
    }

    async deposit(
        { 
            asset, 
            chainId, 
            amount, 
            privateKey,
            network,
            rpcs,
            generatedAddress,
        }: DepositParams,
    ): Promise<DepositResponse> {
        if (asset === HyperliquidDepositAsset.Usdc && chainId === ChainId.Arbitrum) {
            return this.depositArbitrum({ asset, chainId, amount, privateKey, network, rpcs, generatedAddress })
        }
        return this.depositOther({ asset, chainId, amount, privateKey, network, rpcs, generatedAddress })
    }
}

export interface DepositParams {
    asset: HyperliquidDepositAsset
    chainId: ChainId
    amount: number
    privateKey: string
    network: Network
    rpcs: Array<string>
    generatedAddress?: string
}

export interface DepositResponse {
    txHash: string
}