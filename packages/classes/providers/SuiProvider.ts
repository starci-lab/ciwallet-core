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
import { computeDenomination } from "@ciwallet-sdk/utils"
import BN from "bn.js"

export interface SuiProviderParams {
    chainId: ChainId;
    network: Network;
    rpcs: Array<string>;
}

export class SuiProvider implements IAction, IQuery {
    private readonly client: SuiClient

    constructor(public readonly params: SuiProviderParams) {
        this.client = new SuiClient({ url: this.params.rpcs.at(0)! })
    }

    async transfer(params: TransferParams): Promise<TransferResponse> {
        throw new Error("Transfer not implemented for Sui", {
            cause: {
                params,
            },
        })
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
