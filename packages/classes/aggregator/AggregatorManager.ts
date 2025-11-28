import { ChainId, Network } from "@ciwallet-sdk/types"
import type { IAggregator, QuoteParams, QuoteResponse } from "./IAggregator"
import { MadhouseAggregator } from "./MadhouseAggregator"
import { LifiAggregator } from "./LifiAggregator"
import { JupiterAggregator } from "./JupiterAggregator"

export enum AggregatorId {
    Madhouse = "madhouse",
    Lifi = "lifi",
    Jupiter = "jupiter",
}

export enum AggregationMode {
    SingleChain = "single-chain",
    CrossChain = "cross-chain",
    Hybrid = "hybrid",
}

export interface SingleChainAggregatorData {
    mode: AggregationMode.SingleChain;
    id: AggregatorId;
    name: string;
    url: string;
    logo: string;
    chain: ChainId;
    instance: IAggregator;
    networks: Array<Network>;
}

export interface CrossChainAggregatorData {
    mode: AggregationMode.CrossChain | AggregationMode.Hybrid;
    id: AggregatorId;
    name: string;
    url: string;
    logo: string;
    chains: Array<ChainId>;
    instance: IAggregator;
    networks: Array<Network>;
}

export type AggregatorData =
  | SingleChainAggregatorData
  | CrossChainAggregatorData;

export interface AggregatorManagerConstructorParams {
    lifi: {
        integrator: string;
        apiKey: string;
    };
}
export class AggregatorManager {
    private aggregators: Partial<Record<AggregatorId, AggregatorData>> = {}
    constructor(
        private readonly params: AggregatorManagerConstructorParams,
    ) {
        this.aggregators = {
            [AggregatorId.Madhouse]: {
                id: AggregatorId.Madhouse,
                name: "Madhouse",
                url: "https://madhouse.ag/",
                logo: "/assets/aggregators/madhouse.webp",
                instance: new MadhouseAggregator(),
                chain: ChainId.Monad,
                mode: AggregationMode.SingleChain,
                networks: [Network.Testnet],
            },
            [AggregatorId.Jupiter]: {
                id: AggregatorId.Jupiter,
                name: "Jupiter",
                url: "https://jupiter.ag/",
                logo: "/assets/aggregators/jupiter.png",
                instance: new JupiterAggregator(),
                chain: ChainId.Solana,
                mode: AggregationMode.SingleChain,
                networks: [Network.Mainnet],
            },
            [AggregatorId.Lifi]: {
                id: AggregatorId.Lifi,
                name: "Lifi",
                url: "https://lifi.io/",
                logo: "/assets/aggregators/lifi.png",
                instance: new LifiAggregator({
                    apiKey: this.params.lifi.apiKey,
                    integrator: this.params.lifi.integrator,
                }),
                chains: [ChainId.Solana, ChainId.Sui],
                mode: AggregationMode.Hybrid,
                networks: [Network.Mainnet],
            },
        }
    }

    public toObject(): Partial<Record<AggregatorId, AggregatorData>> {
        return this.aggregators
    }

    public getAggregatorById(id: AggregatorId): AggregatorData | undefined {
        return this.aggregators[id]
    }

    public getAggregators(): Array<AggregatorData> {
        return Object.values(this.aggregators)
    }

    public async batchQuote(
        params: QuoteParams
    ): Promise<Partial<Record<AggregatorId, QuoteResponse>>> {
        const results: Partial<Record<AggregatorId, QuoteResponse>> = {}
        const promises: Array<Promise<void>> = []
        let selectedAggregators: Array<AggregatorData> = []
        // swap within the same chain
        if (params.fromChainId === params.toChainId) {
            selectedAggregators = this.getAggregators().filter(
                aggregator => {    
                    const isSingleChainSelected = aggregator.mode === AggregationMode.SingleChain && aggregator.chain === params.fromChainId
                    const isHybridSelected = aggregator.mode === AggregationMode.Hybrid && aggregator.chains.includes(params.fromChainId)
                    return (isSingleChainSelected || isHybridSelected) && aggregator.networks.includes(params.network)
                })
        }
        // swap between different chains
        else {
            selectedAggregators = this.getAggregators().filter(aggregator => {
                const isCrossChainSelected = aggregator.mode === AggregationMode.CrossChain && aggregator.chains.includes(params.fromChainId) && aggregator.chains.includes(params.toChainId)
                const isHybridSelected = aggregator.mode === AggregationMode.Hybrid && aggregator.chains.includes(params.fromChainId) && aggregator.chains.includes(params.toChainId)
                return (isCrossChainSelected || isHybridSelected) && aggregator.networks.includes(params.network)
            })
        }
        for (const aggregator of selectedAggregators) {
            promises.push((async (): Promise<void> => {
                try {
                    const result = await aggregator.instance.quote(params)
                    results[aggregator.id] = result
                } catch (error) {
                    console.error(error)
                }
            })())
        }
        await Promise.allSettled(promises)
        return results
    }
}
