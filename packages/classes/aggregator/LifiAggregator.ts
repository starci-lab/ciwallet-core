import { createConfig, getQuote, ChainId as LifiChainId } from "@lifi/sdk"
import { ChainId, Platform } from "@ciwallet-sdk/types"
import type { IAggregator, QuoteParams, QuoteResponse } from "./IAggregator"
import SuperJSON from "superjson"
import { chainIdToPlatform, computeDenomination, computeRaw } from "@ciwallet-sdk/utils"
import BN from "bn.js"

export interface LifiAggregatorConstructorParams {
    integrator: string;
    apiKey: string;
}

export const chainIdToLifiChainId = (chainId: ChainId): LifiChainId => {
    switch (chainId) {
    case ChainId.Sui:
        return LifiChainId.SUI
    case ChainId.Solana:
        return LifiChainId.SOL
    case ChainId.Aptos:
        throw new Error(`Unsupported chainId: ${chainId}`)
    case ChainId.Monad:
        throw new Error(`Unsupported chainId: ${chainId}`)
    default:
        throw new Error(`Unsupported chainId: ${chainId}`)
    }
}

const ZERO_LIFI_EVM_ADDRESS = "0x0000000000000000000000000000000000000000"
const ZERO_LIFI_SOLANA_ADDRESS = "11111111111111111111111111111111"

export class LifiAggregator implements IAggregator {
    constructor(
        {
            integrator,
            apiKey,
        }: LifiAggregatorConstructorParams,
    ) {
        createConfig({
            integrator,
            apiKey
        })
    }

    async quote(
        { 
            fromTokenAddress, 
            toTokenAddress, 
            fromTokenDecimals,
            amount, 
            fromChainId, 
            toChainId, 
            fromAddress,
            toTokenDecimals,
            toAddress,
            slippage,
        } : QuoteParams
    ): Promise<QuoteResponse> {
        const zeroAddress = (chainId: ChainId) => {
            const platform = chainIdToPlatform(chainId)
            switch (platform) {
            case Platform.Solana:
                return ZERO_LIFI_SOLANA_ADDRESS
            case Platform.Evm:
                return ZERO_LIFI_EVM_ADDRESS
            default:
                throw new Error(`Unsupported chainId: ${chainId}`)
            }
        }
        if (!fromTokenAddress) {
            fromTokenAddress = zeroAddress(fromChainId)
        }
        if (!toTokenAddress) {
            toTokenAddress = zeroAddress(toChainId)
        }
        const quote = await getQuote({
            fromChain: chainIdToLifiChainId(fromChainId),
            toChain: chainIdToLifiChainId(toChainId),
            fromAddress,
            toAddress,
            fromToken: fromTokenAddress || ZERO_LIFI_EVM_ADDRESS,
            toToken: toTokenAddress || ZERO_LIFI_EVM_ADDRESS,
            fromAmount: computeRaw(amount, fromTokenDecimals).toString(),
            slippage,
        })
        return {
            amountOut: computeDenomination(new BN(quote.estimate.toAmount), toTokenDecimals).toNumber(),
            serializedTx: SuperJSON.stringify(quote.id ?? ""),
            routes: [],
            rawRoutes: [
                {
                    id: quote.toolDetails.key,
                    name: quote.toolDetails.name,
                    imageUrl: quote.toolDetails.logoURI,
                },
            ]
        }
    }
}