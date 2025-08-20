import type { Chain, IWalletAdapter } from "@/providers"
import type { ChainId, Network } from "@/types"
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
import erc20Abi from "erc-20-abi"
import { Contract, ethers } from "ethers"
export class EvmProvider implements IAction, IQuery {
    private readonly chain: Chain
    private readonly provider: ethers.JsonRpcProvider
    constructor(
    public readonly chainId: ChainId,
    public readonly network: Network,
    public readonly walletAdapter: IWalletAdapter,
    ) {
        const { chains } = this.walletAdapter
        if (!chains.some(
            chain => chain.chainId === chainId
        )) {
            throw new Error(`Chain ${chainId} is not supported`)
        }
        this.chain = chains.find(
            chain => chain.chainId === chainId
        )!
        this.provider = new ethers.JsonRpcProvider(this.chain.rpcs.at(0)!)
    }

    async transfer({
        amount,
        toAddress,
        decimals = 18
    }: TransferParams): Promise<TransferResponse> {
        const contract = new Contract(toAddress, erc20Abi, this.provider)
        const tx = await contract.getFunction("transfer").send(
            toAddress,
            ethers.parseUnits(amount.toString(), decimals)
        )
        return {
            txHash: tx.hash,
        }
    }

    async fetchBalance({
        accountAddress,
        tokenAddress
    }: FetchBalanceParams): Promise<FetchBalanceResponse> {
        const contract = new Contract(tokenAddress, erc20Abi, this.provider)
        const amount = await contract.getFunction("balanceOf").call(accountAddress)
        return {
            amount
        }
    }

    async fetchTokenMetadata(
        params: FetchTokenMetadataParams,
    ): Promise<FetchTokenMetadataResponse> {
        console.log(params)
        throw new Error("Not implemented")
    }

    async approve({
        spender,
        amount,
        tokenAddress
    }: ApproveParams): Promise<ApproveResponse> {
        const contract = new Contract(tokenAddress, erc20Abi, this.provider)
        const tx = await contract.getFunction("approve").send(
            spender,
            amount
        )
        return {
            txHash: tx.hash,
        }
    }
}