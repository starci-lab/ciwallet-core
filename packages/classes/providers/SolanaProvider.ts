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
    createSolanaRpc,
    type Rpc,
    type SolanaRpcApi
} from "@solana/kit"
import { computeDenomination } from "@ciwallet-sdk/utils"
import BN from "bn.js"
import { fetchToken, findAssociatedTokenPda, TOKEN_PROGRAM_ADDRESS} from "@solana-program/token"
import { TOKEN_2022_PROGRAM_ADDRESS, fetchToken as fetchToken2022 } from "@solana-program/token-2022"

export interface SolanaProviderParams {
    chainId: ChainId;
    network: Network;
    // left this blank if you don't want to sign the transaction
    privateKey?: string;
    rpcs: Array<string>;
}

export class SolanaProvider implements IAction, IQuery {
    private readonly rpc: Rpc<SolanaRpcApi>
    constructor(
    public readonly params: SolanaProviderParams,
    ) {
        this.rpc = createSolanaRpc(this.params.rpcs.at(0)!)
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
