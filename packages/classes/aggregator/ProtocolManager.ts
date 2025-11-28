import type { QuoteResponse, Route } from "./IAggregator"
import { AggregatorId } from "./AggregatorManager"

export enum ProtocolId {
  NativeWrapper = "native-wrapper",
  UniswapV2 = "uniswap-v2",
  UniswapV3 = "uniswap-v3",
  PancakeSwapV2 = "pancakeswap-v2",
  PancakeSwapV3 = "pancakeswap-v3",
  AtlantisV2 = "atlantis-v2",
  AprioriLiquidStaking = "apriori-liquid-staking",
  MagmaLiquidStaking = "magma-liquid-staking",
  Shmonad = "shmonad",
  Kintsu = "kintsu",
  OctoswapV1 = "octoswap-v1",
  GlacierFi = "glacier-fi",
  Kuru = "kuru",
  ZkSwapV2 = "zkswap-v2",
  ZkSwapV3 = "zkswap-v3",
  Crystal = "crystal",
  Purps = "purps",
  Madhouse = "madhouse",
}

export interface ProtocolData {
  id: ProtocolId;
  name: string;
  url?: string;
  logo?: string;
}

export class ProtocolManager {
    private defaultProtocols: Record<ProtocolId, ProtocolData> = {
        [ProtocolId.NativeWrapper]: {
            id: ProtocolId.NativeWrapper,
            name: "Native Wrapper",
        },
        [ProtocolId.UniswapV2]: {
            id: ProtocolId.UniswapV2,
            name: "Uniswap V2",
            logo: "/assets/protocols/uniswap.png",
            url: "https://app.uniswap.org",
        },
        [ProtocolId.UniswapV3]: {
            id: ProtocolId.UniswapV3,
            name: "Uniswap V3",
            logo: "/assets/protocols/uniswap.png",
            url: "https://app.uniswap.org",
        },
        [ProtocolId.PancakeSwapV2]: {
            id: ProtocolId.PancakeSwapV2,
            name: "PancakeSwap V2",
            logo: "/assets/protocols/pancakeswap.png",
            url: "https://app.pancakeswap.finance",
        },
        [ProtocolId.PancakeSwapV3]: {
            id: ProtocolId.PancakeSwapV3,
            name: "PancakeSwap V3",
            logo: "/assets/protocols/pancakeswap.png",
            url: "https://app.pancakeswap.finance",
        },
        [ProtocolId.AtlantisV2]: {
            id: ProtocolId.AtlantisV2,
            name: "Atlantis V2",
            logo: "/assets/protocols/atlantis.jpg",
            url: "https://atlantisdex.xyz/",
        },
        [ProtocolId.AprioriLiquidStaking]: {
            id: ProtocolId.AprioriLiquidStaking,
            name: "Apriori Liquid Staking",
            logo: "/assets/protocols/apriori-liquid-staking.jpg",
            url: "https://www.apr.io/",
        },
        [ProtocolId.Crystal]: {
            id: ProtocolId.Crystal,
            name: "Crystal",
            logo: "/assets/protocols/crystal.webp",
            url: "https://https://crystal.exchange/",
        },
        [ProtocolId.Purps]: {
            id: ProtocolId.Purps,
            name: "Purps",
            logo: "/assets/protocols/purps.png",
            url: "https://app.purps.xyz",
        },
        [ProtocolId.Madhouse]: {
            id: ProtocolId.Madhouse,
            name: "Madhouse",
            logo: "/assets/protocols/madhouse.png",
            url: "https://madhouse.ag/",
        },
        [ProtocolId.MagmaLiquidStaking]: {
            id: ProtocolId.MagmaLiquidStaking,
            name: "Magma Liquid Staking",
            url: "https://www.magmastaking.xyz/",
            logo: "/assets/protocols/magma-liquid-staking.webp",
        },
        [ProtocolId.OctoswapV1]: {
            id: ProtocolId.OctoswapV1,
            name: "Octoswap V1",
            logo: "/assets/protocols/octoswap.webp",
            url: "https://octo.exchange/",
        },
        [ProtocolId.GlacierFi]: {
            id: ProtocolId.GlacierFi,
            name: "GlacierFi",
            logo: "/assets/protocols/glacierfi.jpg",
            url: "https://glacierfi.com/",
        },
        [ProtocolId.Kuru]: {
            id: ProtocolId.Kuru,
            name: "Kuru",
            logo: "/assets/protocols/kuru.webp",
            url: "https://www.kuru.io/",
        },
        [ProtocolId.ZkSwapV2]: {
            id: ProtocolId.ZkSwapV2,
            name: "ZkSwap V2",
            logo: "/assets/protocols/zkswap.jpg",
            url: "https://www.zkswap.finance/",
        },
        [ProtocolId.ZkSwapV3]: {
            id: ProtocolId.ZkSwapV3,
            name: "ZkSwap V3",
            logo: "/assets/protocols/zkswap.jpg",
            url: "https://www.zkswap.finance/",
        },
        [ProtocolId.Shmonad]: {
            id: ProtocolId.Shmonad,
            name: "Shmonad",
            logo: "/assets/protocols/shmonad.avif",
            url: "https://shmonad.xyz/",
        },
        [ProtocolId.Kintsu]: {
            id: ProtocolId.Kintsu,
            name: "Kintsu",
            logo: "/assets/protocols/kintsu.webp",
            url: "https://kintsu.xyz/",
        },
    }

    private protocols: Partial<Record<ProtocolId, ProtocolData>> = {}
    constructor() {
        this.protocols = this.defaultProtocols
    }

    public toObject(): Partial<Record<ProtocolId, ProtocolData>> {
        return this.protocols
    }

    public getProtocolById(id: ProtocolId): ProtocolData | undefined {
        return this.protocols[id]
    }

    public getBestQuote(
        params: Partial<Record<AggregatorId, QuoteResponse>>
    ): BestQuote | null {
        const entries = Object.entries(params) as Array<[AggregatorId, QuoteResponse]>
        if (entries.length === 0) return null
    
        const [bestKey, bestQuote] = entries.reduce(
            ([accKey, accQuote], [currKey, currQuote]) =>
                accQuote.amountOut > currQuote.amountOut
                    ? [accKey, accQuote]
                    : [currKey, currQuote],
            entries[0]
        )
        return {
            aggregator: bestKey,
            quote: bestQuote,
        }
    }

    public getProtocols({ routes, rawRoutes }: QuoteResponse): Array<ProtocolData> {
        const result: Array<ProtocolData> = []
        if (rawRoutes) {
            for (const rawRoute of rawRoutes) {
                result.push({
                    id: rawRoute.id as ProtocolId,
                    name: rawRoute.name,
                    logo: rawRoute.imageUrl,
                })
            }
            return result
        }
        const traverse = (routeList: Route[]) => {
            for (const route of routeList) {
                const protocol = this.protocols[route.protocol]
                if (protocol) result.push(protocol)
                if (route.routes && route.routes.length > 0) {
                    traverse(route.routes)
                }
            }
        }
        traverse(routes)
        // remove duplicate based on id
        const unique = Array.from(new Map(result.map((p) => [p.id, p])).values())
        return unique
    }
}

export interface BestQuote {
    aggregator: AggregatorId
    quote: QuoteResponse
}