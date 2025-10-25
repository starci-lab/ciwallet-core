import { createConfig, getQuote, ChainId as LifiChainId } from "@lifi/sdk"
import { ChainId } from "@ciwallet-sdk/types"
import type { IAggregator, QuoteParams, QuoteResponse } from "./IAggregator"
import SuperJSON from "superjson"

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
        params: QuoteParams
    ): Promise<QuoteResponse> {
        const { 
            fromToken, 
            toToken, 
            amount, 
            fromChainId, 
            toChainId, 
            fromAddress,
            toAddress,
            slippage,
        } = params
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
            amountOut: Number(quote.estimate.toAmount),
            serializedTx: SuperJSON.stringify(quote.id ?? ""),
            routes: [],
        }
    }
}