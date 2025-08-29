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
import { erc20Abi } from "@ciwallet-sdk/misc"
import { Contract, ethers } from "ethers"
import { toDenomination } from "@ciwallet-sdk/utils"
import BN from "bn.js"

export class EvmProvider implements IAction, IQuery {
    private readonly chain: Chain
    private readonly provider: ethers.JsonRpcProvider
    constructor(
    public readonly chainId: ChainId,
    public readonly network: Network,
    public readonly walletAdapter: IWalletAdapter
    ) {
        const { chains } = this.walletAdapter
        if (!chains.some((chain) => chain.chainId === chainId)) {
            throw new Error(`Chain ${chainId} is not supported`)
        }
        this.chain = chains.find((chain) => chain.chainId === chainId)!
        this.provider = new ethers.JsonRpcProvider(this.chain.rpcs.at(0)!)
    }

    async transfer({
        amount,
        toAddress,
        tokenAddress,
        decimals = 18,
    }: TransferParams): Promise<TransferResponse> {
        const contract = new Contract(tokenAddress, erc20Abi, this.provider)
        const tx = await contract
            .getFunction("transfer")
            .send(toAddress, ethers.parseUnits(amount.toString(), decimals))
        return {
            txHash: tx.hash,
        }
    }

    async fetchBalance({
        accountAddress,
        tokenAddress,
        decimals,
    }: FetchBalanceParams): Promise<FetchBalanceResponse> {
        if (!tokenAddress) {
            const balance = await this.provider.getBalance(accountAddress)
            return {
                amount: toDenomination(new BN(balance), decimals),
            }
        }
        const contract = new Contract(tokenAddress, erc20Abi, this.provider)
        try {
            const rawAmount = await contract.getFunction("balanceOf").staticCall(accountAddress)
            const amount = toDenomination(new BN(rawAmount), decimals)
            return {
                amount,
            }
        } catch (error) {
            console.log(error)
            return {
                amount: 0,
            }
        }
    }

    async fetchTokenMetadata(
        params: FetchTokenMetadataParams
    ): Promise<FetchTokenMetadataResponse> {
        console.log(params)
        throw new Error("Not implemented")
    }

    async approve({
        spender,
        amount,
        tokenAddress,
    }: ApproveParams): Promise<ApproveResponse> {
        const contract = new Contract(tokenAddress, erc20Abi, this.provider)
        const tx = await contract.getFunction("approve").send(spender, amount)
        return {
            txHash: tx.hash,
        }
    }
}
