import { computeDenomination, computeRaw, httpsToWss } from "@ciwallet-sdk/utils"
import type {
    IAggregator,
    QuoteParams,
    QuoteResponse,
    SignAndSendTransactionParams,
    SignAndSendTransactionResponse,
} from "./IAggregator"
import BN from "bn.js"
import { 
    address, 
    getBase64Encoder, 
    getTransactionDecoder, 
    getCompiledTransactionMessageDecoder, 
    type Address, 
    decompileTransactionMessageFetchingLookupTables, 
    createSolanaRpc, 
    createKeyPairFromBytes, 
    createSignerFromKeyPair, 
    pipe, 
    createTransactionMessage, 
    addSignersToTransactionMessage, 
    setTransactionMessageFeePayerSigner, 
    setTransactionMessageLifetimeUsingBlockhash, 
    appendTransactionMessageInstructions, 
    isTransactionMessageWithinSizeLimit, 
    compileTransaction, 
    signTransaction, 
    assertIsTransactionWithinSizeLimit, 
    assertIsSendableTransaction, 
    sendAndConfirmTransactionFactory, 
    createSolanaRpcSubscriptions, 
    getSignatureFromTransaction
} from "@solana/kit"
import { createJupiterApiClient, SwapApi } from "@jup-ag/api"
import base58 from "bs58"

const WSOL_ADDRESS = address("So11111111111111111111111111111111111111112")
const USDC_ADDRESS = address("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")
export class JupiterAggregator implements IAggregator {
    private readonly swapApi: SwapApi
    constructor() {
        this.swapApi = createJupiterApiClient({
            basePath: "https://api.jup.ag/**",
            apiKey: "bf7f948e-1a9c-4cf9-8d6f-5c0d9effcfdb",
        })
    }
    private jupiterReferralTokenAccounts(): Record<string, Address> {
        return {
            [WSOL_ADDRESS]: address("JRiWp4o5k9mJSKbp9DsbkZw1FHQNWmJCDDa6aUYKHzn"),
            [USDC_ADDRESS]: address("7n59ZyqB6i3aoakFvF8TneHYGHhnwUNEYMHmvJMLz37R"),
        }
    }
    async quote(
        params: QuoteParams
    ): Promise<QuoteResponse> {
        const quoteResponse = await this.swapApi.quoteGet({
            inputMint: params.fromTokenAddress || WSOL_ADDRESS,
            outputMint: params.toTokenAddress || WSOL_ADDRESS,
            amount: computeRaw(params.amount, params.fromTokenDecimals).toNumber(),
            slippageBps: params.slippage * 10000,
            platformFeeBps: 2,   
        })  
        const feeAccount = this.jupiterReferralTokenAccounts()[params.fromTokenAddress || WSOL_ADDRESS]
        const { 
            swapTransaction
        } = await this.swapApi.swapPost({
            swapRequest: {
                quoteResponse,
                userPublicKey: params.fromAddress,
                dynamicComputeUnitLimit: true,
                feeAccount,   
            }
        })
        return {
            amountOut: computeDenomination(new BN(quoteResponse.outAmount.toString()), params.toTokenDecimals).toNumber(),
            serializedTx: swapTransaction,
            routes: [],
        }
    }

    async signAndSendTransaction({
        serializedTx,
        privateKey,
        rpcs,
    }: SignAndSendTransactionParams): Promise<SignAndSendTransactionResponse> {
        const url = rpcs.at(0)!
        const rpc = createSolanaRpc(url)
        const rpcSubscriptions = createSolanaRpcSubscriptions(httpsToWss(url))
        const swapTransactionBytes = getBase64Encoder().encode(serializedTx as string)
        const swapTransaction = getTransactionDecoder().decode(swapTransactionBytes)
        const compiledSwapTransactionMessage = getCompiledTransactionMessageDecoder().decode(
            swapTransaction.messageBytes,
        )
        const swapTransactionMessage = await decompileTransactionMessageFetchingLookupTables(
            compiledSwapTransactionMessage,
            rpc
        )
        const swapInstructions = swapTransactionMessage.instructions
        // we get the latest blockhash
        const { value: latestBlockhash } = await rpc.getLatestBlockhash().send()
        // we sign the transaction
        const keyPair = await createKeyPairFromBytes(base58.decode(privateKey))
        const kitSigner = await createSignerFromKeyPair(keyPair)
        const transactionMessage = pipe(
            createTransactionMessage({ version: 0 }),
            (tx) => addSignersToTransactionMessage([kitSigner], tx),
            (tx) => setTransactionMessageFeePayerSigner(kitSigner, tx),
            (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
            (tx) => appendTransactionMessageInstructions(swapInstructions, tx),
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
}