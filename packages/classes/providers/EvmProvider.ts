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
import { erc20Abi } from "@ciwallet-sdk/misc"
import { Contract, ethers } from "ethers"
import { toDenomination } from "@ciwallet-sdk/utils"
import BN from "bn.js"

export interface EvmProviderParams {
    chainId: ChainId;
    network: Network;
    // left this blank if you don't want to sign the transaction
    privateKey?: string;
    rpcs: Array<string>;
}
export class EvmProvider implements IAction, IQuery {
    private readonly provider: ethers.JsonRpcProvider
    private readonly signer: ethers.Wallet

    constructor(
    public readonly params: EvmProviderParams,
    ) {
        const { privateKey, rpcs } = this.params
        this.provider = new ethers.JsonRpcProvider(rpcs.at(0)!)
        this.signer = privateKey ? new ethers.Wallet(privateKey, this.provider) : undefined!
    }

    // -------------------------------------
    // Transfer native or ERC20 token
    // -------------------------------------
    async transfer({
        amount,
        toAddress,
        tokenAddress,
        decimals = 18,
    }: TransferParams): Promise<TransferResponse> {
        if (!tokenAddress) {
            // Native transfer (ETH, BNB, etc.)
            const tx = await this.signer.sendTransaction({
                to: toAddress,
                value: ethers.parseUnits(amount.toString(), decimals),
            })
            return { txHash: tx.hash }
        }

        // ERC20 transfer
        const contract = new Contract(tokenAddress, erc20Abi, this.signer)
        const tx = await contract.transfer(
            toAddress,
            ethers.parseUnits(amount.toString(), decimals)
        )
        return { txHash: tx.hash }
    }

    // -------------------------------------
    // Approve ERC20 spender
    // -------------------------------------
    async approve({
        spender,
        amount,
        tokenAddress,
        decimals = 18,
    }: ApproveParams): Promise<ApproveResponse> {
        const contract = new Contract(tokenAddress, erc20Abi, this.signer)
        const tx = await contract.approve(
            spender,
            ethers.parseUnits(amount.toString(), decimals)
        )
        return { txHash: tx.hash }
    }

    // -------------------------------------
    // Fetch balance
    // -------------------------------------
    async fetchBalance({
        accountAddress,
        tokenAddress,
        decimals = 18,
    }: FetchBalanceParams): Promise<FetchBalanceResponse> {
        if (!tokenAddress) {
            // native
            const balance = await this.provider.getBalance(accountAddress)
            return { amount: toDenomination(new BN(balance.toString()), decimals) }
        }

        // ERC20
        const contract = new Contract(tokenAddress, erc20Abi, this.provider)
        try {
            const rawAmount = await contract.balanceOf(accountAddress)
            const amount = toDenomination(new BN(rawAmount.toString()), decimals)
            return { amount }
        } catch (error) {
            console.error("fetchBalance error:", error)
            return { amount: 0 }
        }
    }

    // -------------------------------------
    // Fetch token metadata
    // -------------------------------------
    async fetchTokenMetadata(
        params: FetchTokenMetadataParams
    ): Promise<FetchTokenMetadataResponse> {
        console.log(params)
        throw new Error("Not implemented")
    }

    // -------------------------------------
    // Sign message (EIP-191)
    // -------------------------------------
    async signMessage(message: string): Promise<string> {
        return await this.signer.signMessage(message)
    }

    // -------------------------------------
    // (Optional) Sign typed data (EIP-712)
    // -------------------------------------
    async signTypedData(
        domain: Record<string, ethers.TypedDataDomain>,
        types: Record<string, Array<ethers.TypedDataField>>,
        value: Record<string, Record<string, never>>
    ): Promise<string> {
        return await this.signer.signTypedData(domain, types, value)
    }
}