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
                    iconUrl: "/icons/tokens/mon.png",
                    type: TokenType.Wrapped,
                    verified: true,
                },
                {
                    tokenId: TokenId.MonadTestnetUsdc,
                    decimals: 6,
                    symbol: "USDC",
                    name: "USD Coin",
                    iconUrl: "/icons/tokens/usdc.svg",
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

    public getTokensByChainIdAndNetwork(
        chainId: ChainId,
        network: Network
    ): Array<Token> {
        return this.tokens[chainId]?.[network] || []
    }

    public getChainIdByTokenId(tokenId: TokenId): ChainId | undefined {
        for (const chainId of Object.keys(this.tokens) as Array<ChainId>) {
            for (const network of Object.keys(
                this.tokens[chainId] ?? {}
            ) as Array<Network>) {
                const token = this.tokens[chainId]?.[network]?.find(
                    (token) => token.tokenId === tokenId
                )
                if (token) {
                    return chainId
                }
            }
        }
        return undefined
    }
}
