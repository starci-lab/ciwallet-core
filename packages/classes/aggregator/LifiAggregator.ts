import { createConfig, getQuote, ChainId as LifiChainId } from "@lifi/sdk"
import { type ICrossChainAggregator, type QuoteParams, type QuoteResponse } from "./ICrossChainAggregator"
import { ChainId } from "@ciwallet-sdk/types"
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

export class LifiAggregator implements ICrossChainAggregator {
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
        params: QuoteParams
    ): Promise<QuoteResponse> {
        const { query } = params
        const { 
            fromToken, 
            toToken, 
            amount, 
            fromChainId, 
            toChainId, 
            fromAddress,
            toAddress,
            slippage,
        } = query
        const quote = await getQuote({
            fromChain: chainIdToLifiChainId(fromChainId),
            toChain: chainIdToLifiChainId(toChainId),
            fromAddress,
            toAddress,
            fromToken,
            toToken,
            fromAmount: amount.toString(),
            slippage,
        })
        return {
            amountOut: new BN(quote.estimate.toAmount),
        }
    }
}