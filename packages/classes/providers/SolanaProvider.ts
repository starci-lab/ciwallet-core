import type { Chain, IWalletAdapter } from "@ciwallet-sdk/providers"
import type { ChainId, Network } from "@ciwallet-sdk/types"
import type {
    ApproveParams,
    ApproveResponse,
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
    Connection,
    PublicKey,
    SystemProgram,
    Transaction,
    sendAndConfirmRawTransaction,
} from "@solana/web3.js"

import {
    getAssociatedTokenAddress,
    createTransferInstruction,
    getAccount,
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token"

export class SolanaProvider implements IAction, IQuery {
    private readonly connection: Connection
    private readonly publicKey: PublicKey
    constructor(
    public readonly chainId: ChainId,
    public readonly network: Network,
    public readonly privateKey: string,
    private readonly rpcs: Array<string>,
    ) {
        this.connection = new Connection(this.rpcs.at(0)!, "confirmed")
        this.publicKey = new PublicKey(
            "3xaKeNNV4gdAs6ovtjrxtfUqc5bG2q6hbokP8qM3ToQu",
        )
    }

    /** Transfer SOL or SPL token */
    async transfer({
        amount,
        toAddress,
        tokenAddress,
        decimals = 9,
    }: TransferParams): Promise<TransferResponse> {
        throw new Error("Transfer not implemented for Solana", {
            cause: {
                amount,
                toAddress,
                tokenAddress,
                decimals,
            },
        })
    }

    /** Fetch balance of SOL or SPL token */
    async fetchBalance({
        accountAddress,
        tokenAddress,
        decimals = 9,
    }: FetchBalanceParams): Promise<FetchBalanceResponse> {
        const pubkey = new PublicKey(accountAddress)

        if (!tokenAddress) {
            const balance = await this.connection.getBalance(pubkey)
            return { amount: balance / 10 ** decimals }
        }

        try {
            const mint = new PublicKey(tokenAddress)
            const ata = await getAssociatedTokenAddress(mint, pubkey)
            const account = await getAccount(this.connection, ata)
            return { amount: Number(account.amount) / 10 ** decimals }
        } catch (err) {
            console.error(err)
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

    /** Approve in Solana (not the same as ERC20!) */
    async approve({
        spender,
        amount,
        tokenAddress,
    }: ApproveParams): Promise<ApproveResponse> {
    // SPL tokens don’t have “approve” like ERC20.
    // You’d need delegate authority via createApproveInstruction.
        console.log(spender, amount, tokenAddress)

        throw new Error("Approve not supported yet on Solana")
    }
}
