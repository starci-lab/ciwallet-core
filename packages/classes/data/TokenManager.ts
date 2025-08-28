import {
    ChainId,
    Network,
    type Token,
    TokenId,
    TokenType,
} from "@ciwallet-sdk/types"

export type Tokens = Partial<
  Record<ChainId, Partial<Record<Network, Array<Token>>>>
>;
export class TokenManager {
    private tokens: Tokens = {}
    private defaultTokens: Tokens = {
        [ChainId.Monad]: {
            [Network.Mainnet]: [
                {
                    tokenId: TokenId.MonadTestnetMon,
                    decimals: 18,
                    symbol: "MON",
                    name: "Monad",
                    iconUrl: "/icons/tokens/mon.png",
                    type: TokenType.Native,
                    verified: true,
                },
                {
                    tokenId: TokenId.MonadTestnetWmon,
                    decimals: 18,
                    symbol: "WMON",
                    name: "Wrapped MON",
                    iconUrl:
            "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/MON.png/public",
                    type: TokenType.Wrapped,
                    verified: true,
                },
                {
                    tokenId: TokenId.MonadTestnetUsdc,
                    decimals: 6,
                    symbol: "USDC",
                    name: "USD Coin",
                    iconUrl:
            "https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/usdc.png/public",
                    type: TokenType.Stable,
                    verified: true,
                },
            ],
        },
    }
    constructor() {
        this.tokens = this.defaultTokens
    }

    public toObject(): Tokens {
        return this.tokens
    }

    public getTokensByChainIdAndNetwork(chainId: ChainId, network: Network): Array<Token> {
        return this.tokens[chainId]?.[network] || []
    }
}
