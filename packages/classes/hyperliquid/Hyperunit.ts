import { ChainId, Network } from "@ciwallet-sdk/types"
import type { HyperliquidDepositAsset } from "./types"
import * as hl from "@nktkas/hyperliquid"
import axios from "axios"
import { privateKeyToAccount } from "viem/accounts"
import { signUserSignedAction } from "@nktkas/hyperliquid/signing"
import { ApproveAgentRequest, ApproveAgentTypes, parser } from "@nktkas/hyperliquid/api/exchange"
const HYPERUNIT_ENDPOINT_MAINNET = "https://api.hyperunit.xyz"
const HYPERUNIT_ENDPOINT_TESTNET = "https://api.hyperunit-testnet.xyz"

export class Hyperunit {
    private readonly axiosInstances = Object.fromEntries(
        Object.values(Network).map((network) => [
            network, axios.create({
                baseURL: network === Network.Mainnet ? HYPERUNIT_ENDPOINT_MAINNET : HYPERUNIT_ENDPOINT_TESTNET,
            }),
        ])
    )

    private readonly getExchangeClient = (network: Network, privateKey: string) => {
        return new hl.ExchangeClient({
            transport: new hl.HttpTransport({
                isTestnet: network === Network.Testnet,
            }),
            wallet: privateKeyToAccount(privateKey as `0x${string}`),
        })
    }

    private readonly infoClients = Object.fromEntries(
        Object.values(Network).map((network) => [
            network, new hl.InfoClient({
                transport: new hl.HttpTransport({
                    isTestnet: network === Network.Testnet,
                }),
            }),
        ])
    )
    
    async generateAddress(
        {
            sourceChain,
            destinationChain,
            asset,
            destinationAddress,
            network,
        }: HyperunitGenerateAddressParams,
    ): Promise<HyperunitGenerateAddressResponse> {
        if (sourceChain === ChainId.Arbitrum) {
            return {
                address: "0x2Df1c51E09aECF9cacB7bc98cB1742757f163dF7",
            }
        }
        const chainMap: Partial<Record<ChainId, string>> = {
            [ChainId.Ethereum]: "ethereum",
            [ChainId.Solana]: "solana",
            [ChainId.Bitcoin]: "bitcoin",
            [ChainId.Plasma]: "plasma",
            [ChainId.Hyperliquid]: "hyperliquid",
        }
        const { data } = await this.axiosInstances[network]
            .get<HyperunitGenerateAddressResponse>(
                `/gen/${chainMap[sourceChain]}/${chainMap[destinationChain]}/${asset}/${destinationAddress}`
            )
        return data
    }

    async userInfoLegalCheck(
        {
            accountAddress,
            network,
        }: HyperunitUserInfoLegalCheckParams,
    ): Promise<HyperunitUserInfoLegalCheckResponse> {
        const { ipAllowed, acceptedTerms, userAllowed } = await this.infoClients[network].legalCheck({
            user: accountAddress,
        })
        return { ipAllowed, acceptedTerms, userAllowed }
    }

    async userInfoApproveAgent(
        {
            accountAddress,
            network,
            privateKey,
        }: HyperunitApproveAgentActionParams,
    ): Promise<HyperunitUserInfoApproveAgentResponse> {
        const action = parser(ApproveAgentRequest.entries.action)({ // for correct signature generation
            type: "approveAgent",
            signatureChainId: network === Network.Mainnet ? "0x3E7" : "0x3e6",
            hyperliquidChain:  network === Network.Mainnet ? "Mainnet" : "Testnet",
            agentAddress: accountAddress,
            agentName: "Agent",
            nonce: Date.now(),
        })
        const signature = await signUserSignedAction({ 
            wallet: privateKeyToAccount(privateKey as `0x${string}`),
            action, 
            types: ApproveAgentTypes
        })
        const { data } = await this.axiosInstances[network]
            .post<HyperunitUserInfoApproveAgentResponse>(
                "https://api-ui.hyperliquid.xyz/info",
                { 
                    type: "acceptTerms2", 
                    user: accountAddress,
                    time: action.nonce, 
                    signature,
                }
            )
        return data
    }
}

export interface HyperunitApproveAgentActionParams {
    accountAddress: string
    network: Network
    privateKey: string
}


export interface HyperunitUserInfoApproveAgentParams {
    accountAddress: string
    network: Network
    privateKey: string
}

export interface HyperunitUserInfoApproveAgentResponse {
    ipAllowed: boolean,
    acceptedTerms: boolean
    userAllowed: boolean
}
export interface HyperunitUserInfoLegalCheckParams {
    accountAddress: string
    network: Network
}

export interface HyperunitApproveAgentActionResponse {
    status: string
}
export interface HyperunitUserInfoLegalCheckResponse {
    ipAllowed: boolean,
    acceptedTerms: boolean
    userAllowed: boolean
}

export interface HyperunitGenerateAddressResponse {
    address: string
    signatures?: {
        field_node: string
        hl_node: string
        unit_node: string
        unit_node_signature: string
    },
    status?: string
}

export interface HyperunitGenerateAddressParams {
    sourceChain: ChainId
    destinationChain: ChainId
    asset: HyperliquidDepositAsset
    destinationAddress: string
    network: Network
}
