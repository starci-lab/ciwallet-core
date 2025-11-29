import type { ChainId, Network } from "@ciwallet-sdk/types"
import type {
    IAction,
    TransferParams,
    TransferResponse,
} from "./IAction"
import type {
    FetchBalanceParams,
    FetchBalanceResponse,
    FetchTokenMetadataParams,
    FetchTokenMetadataResponse,
    IQuery,
} from "./IQuery"
import {
    address,
    createSignerFromKeyPair,
    createSolanaRpc,
    createSolanaRpcSubscriptions,
    type Rpc,
    type RpcSubscriptions,
    type SolanaRpcApi,
    type SolanaRpcSubscriptionsApi,
    createKeyPairFromBytes,
    pipe,
    createTransactionMessage,
    addSignersToTransactionMessage,
    setTransactionMessageFeePayerSigner,
    setTransactionMessageLifetimeUsingBlockhash,
    appendTransactionMessageInstructions,
    createNoopSigner,
    isTransactionMessageWithinSizeLimit,
    compileTransaction,
    signTransaction,
    assertIsSendableTransaction,
    assertIsTransactionWithinSizeLimit,
    sendAndConfirmTransactionFactory,
    getSignatureFromTransaction,
    fetchEncodedAccount,
    type Instruction,
} from "@solana/kit"
import { computeDenomination, computeRaw, httpsToWss } from "@ciwallet-sdk/utils"
import BN from "bn.js"
import { 
    fetchToken, 
    findAssociatedTokenPda, 
    TOKEN_PROGRAM_ADDRESS, 
    getCreateAssociatedTokenInstruction,
    getTransferInstruction
} from "@solana-program/token"
import { 
    TOKEN_2022_PROGRAM_ADDRESS, 
    fetchToken as fetchToken2022, 
    getCreateAssociatedTokenInstruction as getCreateAssociatedToken2022Instruction,
    getTransferInstruction as getTransfer2022Instruction
} from "@solana-program/token-2022"
import { getTransferSolInstruction } from "@solana-program/system"
import base58 from "bs58"
export interface SolanaProviderParams {
    chainId: ChainId;
    network: Network;
    // left this blank if you don't want to sign the transaction
    privateKey?: string;
    rpcs: Array<string>;
}

export class SolanaProvider implements IAction, IQuery {
    private readonly rpc: Rpc<SolanaRpcApi>
    private readonly rpcSubscriptions: RpcSubscriptions<SolanaRpcSubscriptionsApi>
    private readonly privateKey?: string
    constructor(
    public readonly params: SolanaProviderParams,
    ) {
        this.rpc = createSolanaRpc(this.params.rpcs.at(0)!)
        this.rpcSubscriptions = createSolanaRpcSubscriptions(httpsToWss(this.params.rpcs.at(0)!))
        this.privateKey = this.params.privateKey
    }

    /** Transfer SOL or SPL token */
    async transfer({
        amount,
        toAddress,
        tokenAddress,
        decimals = 9,
        isToken2022 = false,
    }: TransferParams): Promise<TransferResponse> {
        const keyPair = await createKeyPairFromBytes(base58.decode(this.privateKey ?? ""))
        const kitSigner = await createSignerFromKeyPair(keyPair)
        const { value: latestBlockhash } = await this.rpc.getLatestBlockhash().send()
        if (!tokenAddress) {
            const transactionMessage = pipe(
                createTransactionMessage({ version: 0 }),
                (tx) => addSignersToTransactionMessage([kitSigner], tx),
                (tx) => setTransactionMessageFeePayerSigner(kitSigner, tx),
                (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
                (tx) => appendTransactionMessageInstructions([
                    getTransferSolInstruction({
                        source: createNoopSigner(kitSigner.address),
                        destination: address(toAddress),
                        amount: BigInt(computeRaw(amount, decimals).toString()),
                    })
                ], tx),
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
                rpc: this.rpc,
                rpcSubscriptions: this.rpcSubscriptions,
            })
            const transactionSignature = getSignatureFromTransaction(signedTransaction)
            await sendAndConfirmTransaction(
                signedTransaction, {
                    commitment: "confirmed",
                    maxRetries: BigInt(5),
                })
            return { txHash: transactionSignature.toString() }
        }
        const instructions: Array<Instruction> = []
        const mintAddress = address(tokenAddress)
        const ownerAddress = kitSigner.address
        const [sourceAta] = await findAssociatedTokenPda(
            {
                mint: mintAddress,
                owner: ownerAddress,
                tokenProgram: isToken2022 ? TOKEN_2022_PROGRAM_ADDRESS : TOKEN_PROGRAM_ADDRESS,
            }
        )
        const [destinationAta] = await findAssociatedTokenPda(
            {
                mint: mintAddress,
                owner: address(toAddress),
                tokenProgram: isToken2022 ? TOKEN_2022_PROGRAM_ADDRESS : TOKEN_PROGRAM_ADDRESS,
            }
        )
        const maybeAtaAccount = await fetchEncodedAccount(this.rpc, destinationAta)
        if (!maybeAtaAccount.exists) {
            const _getCreateAssociatedTokenInstruction = isToken2022 
                ? getCreateAssociatedToken2022Instruction 
                : getCreateAssociatedTokenInstruction
            instructions.push(_getCreateAssociatedTokenInstruction({
                mint: mintAddress,
                owner: address(toAddress),
                ata: destinationAta,
                payer: createNoopSigner(kitSigner.address),
            }))
        }

        const _getTransferInstruction = isToken2022 ? getTransfer2022Instruction : getTransferInstruction
        instructions.push(_getTransferInstruction({
            source: sourceAta,
            destination: destinationAta,
            amount: BigInt(computeRaw(amount, decimals).toString()),
            authority: createNoopSigner(kitSigner.address),
        }))
        const transactionMessage = pipe(
            createTransactionMessage({ version: 0 }),
            (tx) => addSignersToTransactionMessage([kitSigner], tx),
            (tx) => setTransactionMessageFeePayerSigner(kitSigner, tx),
            (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
            (tx) => appendTransactionMessageInstructions(instructions, tx),
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
            rpc: this.rpc,
            rpcSubscriptions: this.rpcSubscriptions,
        })
        const transactionSignature = getSignatureFromTransaction(signedTransaction)
        await sendAndConfirmTransaction(
            signedTransaction, {
                commitment: "confirmed",
                maxRetries: BigInt(5),
            })
        return { txHash: transactionSignature.toString() }
    }

    /** Fetch balance of SOL or SPL token */
    async fetchBalance({
        accountAddress,
        tokenAddress,
        decimals = 9,
        isToken2022 = false,
    }: FetchBalanceParams): Promise<FetchBalanceResponse> {
        try {
            if (!tokenAddress) {
                const balance = await this.rpc.getBalance(address(accountAddress)).send()
                return { amount: computeDenomination(new BN(balance.value.toString()), decimals).toNumber() }
            }
            const mintAddress = address(tokenAddress)
            const ownerAddress = address(accountAddress)
            const [ataPublicKey] = await findAssociatedTokenPda(
                {
                    mint: mintAddress,
                    owner: ownerAddress,
                    tokenProgram:
            isToken2022
                ? TOKEN_2022_PROGRAM_ADDRESS
                : TOKEN_PROGRAM_ADDRESS,
                }
            )
            try {
                if (isToken2022) {
                    const token2022 = await fetchToken2022(this.rpc, ataPublicKey)
                    return {
                        amount: computeDenomination(new BN(token2022.data.amount.toString()), decimals).toNumber()
                    }
                } else {
                // Standard SPL token account
                    const tokenAccount = await fetchToken(this.rpc, ataPublicKey)
                    return {
                        amount: computeDenomination(new BN(tokenAccount.data.amount.toString()), decimals).toNumber()
                    }
                }
            } catch {
            // we dont find the ata address, so the balance is 0
                return {
                    amount: 0,
                }
            }
        } catch (error) {
            console.error("fetchBalance error:", error)
            return { amount: 0 }
        }
    }

    /** Metadata (not fully supported without Metaplex) */
    async fetchTokenMetadata(
        params: FetchTokenMetadataParams,
    ): Promise<FetchTokenMetadataResponse> {
        console.log(params)
        throw new Error("Fetch metadata not implemented (need Metaplex)")
    }
}
