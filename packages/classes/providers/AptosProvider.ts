import { ChainId, Network } from "@ciwallet-sdk/types"
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
import { APTOS_COIN, Aptos, AptosConfig, Network as AptosNetwork } from "@aptos-labs/ts-sdk"
import { computeDenomination } from "@ciwallet-sdk/utils"
import BN from "bn.js"

export interface AptosProviderParams {
    chainId: ChainId
    network: Network
    rpcs: Array<string>
}

export class AptosProvider implements IAction, IQuery {
    private readonly client: Aptos

    constructor(public readonly params: AptosProviderParams) {
        const rpcUrl = this.params.rpcs.at(0)!
        const config = new AptosConfig({
            fullnode: rpcUrl,
            network: this.mapNetwork(this.params.network),
        })
        this.client = new Aptos(config)
    }

    private mapNetwork(network: Network): AptosNetwork {
        switch (network) {
        case Network.Mainnet:
            return AptosNetwork.MAINNET
        case Network.Testnet:
            return AptosNetwork.TESTNET
        default:
            throw new Error(`Invalid network: ${network}`)
        }
    }

    async transfer(params: TransferParams): Promise<TransferResponse> {
        throw new Error("Transfer not implemented for Aptos", {
            cause: { params },
        })
    }

    async fetchBalance(params: FetchBalanceParams): Promise<FetchBalanceResponse> {
        const { accountAddress, tokenAddress, decimals = 8 } = params
        const coinType = tokenAddress ?? APTOS_COIN
        const balance = await this.client.getBalance({
            accountAddress,
            asset: coinType,
        })
        const amount = computeDenomination(new BN(balance.toString()), decimals).toNumber()
        return { amount }
    }

    async fetchTokenMetadata(params: FetchTokenMetadataParams): Promise<FetchTokenMetadataResponse> {
        throw new Error("Fetch token metadata not implemented for Aptos", {
            cause: { tokenAddress: params.tokenAddress },
        })
    }
}