import type { IAggregator, QuoteParams, QuoteResponse } from "./IAggregator"
import { MadhouseAggregator } from "./MadhouseAggregator"

export enum AggregatorId {
    Madhouse = "madhouse",
}

export interface AggregatorData {
    id: AggregatorId;
    name: string;
    url: string;
    logo: string;
    instance: IAggregator;
}

export class AggregatorManager {
    private defaultAggregators: Record<AggregatorId, AggregatorData> = {
        [AggregatorId.Madhouse]: {
            id: AggregatorId.Madhouse,
            name: "Madhouse",
            url: "https://madhouse.ag/",
            logo: "/icons/aggregators/madhouse.webp",
            instance: new MadhouseAggregator(),
        },
    }
    private aggregators: Partial<Record<AggregatorId, AggregatorData>> = {}
    constructor() {
        this.aggregators = this.defaultAggregators
    }

    public toObject(): Partial<Record<AggregatorId, AggregatorData>> {
        return this.aggregators
    }

    public getAggregatorById(id: AggregatorId): AggregatorData | undefined {
        return this.aggregators[id]
    }

    public async batchQuote(
        params: QuoteParams
    ): Promise<Record<AggregatorId, QuoteResponse>> {
        const results: Partial<Record<AggregatorId, QuoteResponse>> = {}
        const promises: Array<Promise<void>> = []
        for (const aggregator of Object.values(this.aggregators)) {
            promises.push(
                aggregator.instance.quote(params).then((result) => {
                    results[aggregator.id] = result
                })
            )
        }
        await Promise.all(promises)
        return results as Record<AggregatorId, QuoteResponse>
    }
}
