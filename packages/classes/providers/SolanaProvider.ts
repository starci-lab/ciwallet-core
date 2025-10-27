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
    Connection,
    PublicKey,
} from "@solana/web3.js"

import {
    getAccount,
    getAssociatedTokenAddressSync,
    TOKEN_PROGRAM_ID,
    TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token"
import { computeDenomination } from "@ciwallet-sdk/utils"
import BN from "bn.js"

export interface SolanaProviderParams {
    chainId: ChainId;
    network: Network;
    // left this blank if you don't want to sign the transaction
    privateKey?: string;
    rpcs: Array<string>;
}

export class SolanaProvider implements IAction, IQuery {
    private readonly connection: Connection
    constructor(
    public readonly params: SolanaProviderParams,
    ) {
        this.connection = new Connection(this.params.rpcs.at(0)!, "confirmed")
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
        isToken2022 = false,
    }: FetchBalanceParams): Promise<FetchBalanceResponse> {
        if (!tokenAddress) {
            const balance = await this.connection.getBalance(new PublicKey(accountAddress))
            return { amount: computeDenomination(new BN(balance.toString()), decimals).toNumber() }
        }
        const ataPublicKey = getAssociatedTokenAddressSync(
            new PublicKey(tokenAddress), 
            new PublicKey(accountAddress), 
            false, 
            isToken2022 ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID
        )
        const account = await getAccount(this.connection, ataPublicKey)
        return { amount: computeDenomination(new BN(account.amount.toString()), decimals).toNumber() }
    }

    /** Metadata (not fully supported without Metaplex) */
    async fetchTokenMetadata(
        params: FetchTokenMetadataParams,
    ): Promise<FetchTokenMetadataResponse> {
        console.log(params)
        throw new Error("Fetch metadata not implemented (need Metaplex)")
    }
}
