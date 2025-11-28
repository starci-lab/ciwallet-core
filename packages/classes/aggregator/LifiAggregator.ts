import { 
    createConfig, 
    getQuote, 
    ChainId as LifiChainId, 
    type LiFiStep, 
    getStepTransaction, 
    convertQuoteToRoute 
} from "@lifi/sdk"
import { ChainId, Platform } from "@ciwallet-sdk/types"
import type { 
    IAggregator, 
    QuoteParams, 
    QuoteResponse, 
    SignAndSendTransactionParams, 
    SignAndSendTransactionResponse 
} from "./IAggregator"
import SuperJSON from "superjson"
import { chainIdToPlatform, computeDenomination, computeRaw, httpsToWss } from "@ciwallet-sdk/utils"
import BN from "bn.js"
import { 
    addSignersToTransactionMessage, 
    appendTransactionMessageInstructions, 
    assertIsSendableTransaction, 
    assertIsTransactionWithinSizeLimit,
    compileTransaction, 
    createKeyPairFromBytes, 
    createSignerFromKeyPair, 
    createSolanaRpc, 
    createSolanaRpcSubscriptions, 
    createTransactionMessage, 
    decompileTransactionMessageFetchingLookupTables, 
    getBase64Encoder, 
    getCompiledTransactionMessageDecoder, 
    getSignatureFromTransaction, 
    getTransactionDecoder, 
    isTransactionMessageWithinSizeLimit, 
    pipe, 
    sendAndConfirmTransactionFactory, 
    setTransactionMessageFeePayerSigner, 
    setTransactionMessageLifetimeUsingBlockhash, 
    signTransaction 
} from "@solana/kit"
import base58 from "bs58"

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
        console.log(quote)
        return {
            amountOut: computeDenomination(new BN(quote.estimate.toAmount), toTokenDecimals).toNumber(),
            serializedTx: SuperJSON.stringify(quote),
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

    async signAndSendTransaction(
        {
            serializedTx,
            privateKey,
            rpcs,
            fromChainId,
            toChainId,
            senderAddress,
            recipientAddress,
            network,
            rpcsMultichain,
        }: SignAndSendTransactionParams
    ): Promise<SignAndSendTransactionResponse> {
        const quote = SuperJSON.parse<LiFiStep>(serializedTx ?? "")
        const route = convertQuoteToRoute(quote)
        for (const step of route.steps) {
            const stepTransaction = await getStepTransaction(step)
            switch (step.action.fromChainId) {
            case LifiChainId.SOL: {
                const rpcUrl = rpcsMultichain?.[ChainId.Solana]?.[0] ?? ""
                const rpc = createSolanaRpc(rpcUrl)
                const rpcSubscriptions = createSolanaRpcSubscriptions(httpsToWss(rpcUrl))
                const { value } = await rpc.getLatestBlockhash().send()
                const serializedTransaction = stepTransaction.transactionRequest?.data ?? ""
                const swapTransactionBytes = getBase64Encoder().encode(serializedTransaction as string)
                const swapTransaction = getTransactionDecoder().decode(swapTransactionBytes)
                const compiledSwapTransactionMessage = getCompiledTransactionMessageDecoder().decode(
                    swapTransaction.messageBytes,
                )
                // we decompile the transaction message
                const swapTransactionMessage = await decompileTransactionMessageFetchingLookupTables(
                    compiledSwapTransactionMessage,
                    rpc
                )
                console.log(swapTransactionMessage.instructions)
                const keyPair = await createKeyPairFromBytes(base58.decode(privateKey))
                const kitSigner = await createSignerFromKeyPair(keyPair)
                const transactionMessage = pipe(
                    createTransactionMessage({ version: 0 }),
                    (tx) => addSignersToTransactionMessage([kitSigner], tx),
                    (tx) => setTransactionMessageFeePayerSigner(kitSigner, tx),
                    (tx) => setTransactionMessageLifetimeUsingBlockhash(value, tx),
                    (tx) => appendTransactionMessageInstructions(swapTransactionMessage.instructions, tx),
                )
                if (!isTransactionMessageWithinSizeLimit(transactionMessage)) {
                    throw new Error("Transaction message is too large")
                }
                const transaction = compileTransaction(transactionMessage)
                // sign the transaction
                const signedTransaction = await signTransaction(
                    [keyPair],
                    transaction,
                )
                assertIsSendableTransaction(signedTransaction)
                assertIsTransactionWithinSizeLimit(signedTransaction)
                const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({
                    rpc,
                    rpcSubscriptions,
                })
                const transactionSignature = getSignatureFromTransaction(signedTransaction)
                await sendAndConfirmTransaction(
                    signedTransaction, {
                        commitment: "confirmed",
                        maxRetries: BigInt(5),
                    })
                return {
                    txHash: transactionSignature.toString(),
                }
            }
                break
            case LifiChainId.SUI:
                break
            }
        }
        return {
            txHash: "",
        }   
    }
}