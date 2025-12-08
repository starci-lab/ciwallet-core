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
import { SuiClient } from "@mysten/sui/client"
import { computeDenomination, computeRaw } from "@ciwallet-sdk/utils"
import BN from "bn.js"
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519"
import { Transaction } from "@mysten/sui/transactions"

export interface SuiProviderParams {
    chainId: ChainId;
    network: Network;
    rpcs: Array<string>;
    privateKey?: string;
}

export class SuiProvider implements IAction, IQuery {
    private readonly client: SuiClient
    private readonly signer?: Ed25519Keypair
    constructor(public readonly params: SuiProviderParams) {
        this.client = new SuiClient({ url: this.params.rpcs.at(0)! })
        if (this.params.privateKey) {
            this.signer = Ed25519Keypair.fromSecretKey(this.params.privateKey)
        }
    }

    async transfer(params: TransferParams): Promise<TransferResponse> {
        if (!this.signer) {
            throw new Error("No signer found")
        }
        const { tokenAddress, toAddress, amount, decimals } = params
        const tx = new Transaction()
        // Convert amount
        const amt = computeRaw(amount, decimals).toString()
        if (tokenAddress === "0x2::sui::SUI") {
            const gas = tx.gas
            // split the gas
            const [gasToTransfer] = tx.splitCoins(gas, [amt])
            // Transfer that coin object
            tx.transferObjects([gasToTransfer], toAddress)
            // Sign & send
            const result = await this.client.signAndExecuteTransaction({
                signer: this.signer,
                transaction: tx,
            })
            return { txHash: result.digest }
        }
        // Get a coin object to split
        const coins = await this.client.getCoins({
            owner: this.signer.getPublicKey().toSuiAddress(),
            coinType: tokenAddress,
        })
        if (coins.data.length === 0) {
            throw new Error("No coin balance found")
        }
        // if coin.length > 1, we need to merge them
        const primary = coins.data[0].coinObjectId
        if (coins.data.length > 1) {
            const toMerge = coins.data.slice(1).map((c) => c.coinObjectId)
            tx.mergeCoins(primary, toMerge)
        }
        // split the coin
        const [coinToTransfer] = tx.splitCoins(primary, [amt])
        // Transfer that coin object
        tx.transferObjects([coinToTransfer], toAddress)
        // Sign & send
        const result = await this.client.signAndExecuteTransaction({
            signer: this.signer,
            transaction: tx,
            options: { showEffects: true },
        })
        return { txHash: result.digest }
    }

    async fetchBalance(params: FetchBalanceParams): Promise<FetchBalanceResponse> {
        const { accountAddress, decimals = 9 } = params
        let tokenAddress = params.tokenAddress
        if (!tokenAddress) {
            tokenAddress = "0x2::sui::SUI"
        }
        const result = await this.client.getBalance({
            owner: accountAddress,
            coinType: tokenAddress,
        })
        return { amount: computeDenomination(new BN(result.totalBalance.toString()), decimals).toNumber() }
    }

    async fetchTokenMetadata(params: FetchTokenMetadataParams): Promise<FetchTokenMetadataResponse> {
        throw new Error("Fetch token metadata not implemented for Sui", {
            cause: {
                tokenAddress: params.tokenAddress,
            },
        })
    }
}
