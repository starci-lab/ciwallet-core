import {
    ChainId,
    Network,
    type Token,
    TokenId,
    TokenType,
    UnifiedTokenId,
    type UnifiedToken,
} from "@ciwallet-sdk/types"
import _ from "lodash"

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
                    pythId: "0x31491744e2dbf6df7fcf4ac0820d18a609b49076d45066d3568424e62f686cd1",
                    chainId: ChainId.Monad,
                    network: Network.Mainnet,
                },
                {
                    tokenId: TokenId.MonadTestnetWmon,
                    decimals: 18,
                    symbol: "WMON",
                    name: "Wrapped MON",
                    iconUrl: "/icons/tokens/mon.png",
                    address: "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701",
                    type: TokenType.Wrapped,
                    verified: true,
                    pythId: "0x31491744e2dbf6df7fcf4ac0820d18a609b49076d45066d3568424e62f686cd1",
                    chainId: ChainId.Monad,
                    network: Network.Mainnet,
                },
                {
                    tokenId: TokenId.MonadTestnetUsdc,
                    decimals: 6,
                    symbol: "USDC",
                    name: "USD Coin",
                    address: "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea",
                    iconUrl: "/icons/tokens/usdc.svg",
                    type: TokenType.Stable,
                    verified: true,
                    pythId: "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
                    unifiedTokenId: UnifiedTokenId.Usdc,
                    chainId: ChainId.Monad,
                    network: Network.Testnet,
                },
            ],
            [Network.Testnet]: [
                {
                    tokenId: TokenId.MonadTestnetMon,
                    decimals: 18,
                    symbol: "MON",
                    name: "Monad",
                    iconUrl: "/icons/tokens/mon.png",
                    type: TokenType.Native,
                    verified: true,
                    pythId: "0x31491744e2dbf6df7fcf4ac0820d18a609b49076d45066d3568424e62f686cd1",
                    chainId: ChainId.Monad,
                    network: Network.Testnet,
                },
                {
                    tokenId: TokenId.MonadTestnetWmon,
                    decimals: 18,
                    symbol: "WMON",
                    name: "Wrapped MON",
                    iconUrl: "/icons/tokens/mon.png",
                    address: "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701",
                    type: TokenType.Wrapped,
                    verified: true,
                    pythId: "0x31491744e2dbf6df7fcf4ac0820d18a609b49076d45066d3568424e62f686cd1",
                    chainId: ChainId.Monad,
                    network: Network.Testnet,
                },
                {
                    tokenId: TokenId.MonadTestnetUsdc,
                    decimals: 6,
                    symbol: "USDC",
                    name: "USD Coin",
                    address: "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea",
                    iconUrl: "/icons/tokens/usdc.svg",
                    type: TokenType.Stable,
                    verified: true,
                    pythId: "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
                    unifiedTokenId: UnifiedTokenId.Usdc,
                    chainId: ChainId.Monad,
                    network: Network.Testnet,
                },
            ],
        },
        [ChainId.Solana]: {
            [Network.Mainnet]: [
                {
                    tokenId: TokenId.SolanaMainnetSol,
                    decimals: 9,
                    symbol: "SOL",
                    name: "Solana",
                    iconUrl: "/icons/tokens/solana.png",
                    type: TokenType.Native,
                    verified: true,
                    pythId: "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d",
                    chainId: ChainId.Solana,
                    network: Network.Mainnet,
                },
                {
                    tokenId: TokenId.SolanaMainnetUsdc,
                    decimals: 6,
                    symbol: "USDC",
                    name: "USD Coin",
                    address: "So11111111111111111111111111111111111111112", // example
                    iconUrl: "/icons/tokens/usdc.svg",
                    type: TokenType.Stable,
                    verified: true,
                    pythId: "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
                    unifiedTokenId: UnifiedTokenId.Usdc,
                    chainId: ChainId.Solana,
                    network: Network.Mainnet,
                },
            ],
            [Network.Testnet]: [
                {
                    tokenId: TokenId.SolanaTestnetSol,
                    decimals: 9,
                    symbol: "SOL",
                    name: "Solana",
                    iconUrl: "/icons/tokens/solana.png",
                    type: TokenType.Native,
                    verified: true,
                    chainId: ChainId.Solana,
                    network: Network.Testnet,
                },
            ],
        },

        [ChainId.Sui]: {
            [Network.Mainnet]: [
                {
                    tokenId: TokenId.SuiMainnetSui,
                    decimals: 9,
                    symbol: "SUI",
                    name: "Sui",
                    iconUrl: "/icons/tokens/sui.jpeg",
                    type: TokenType.Native,
                    verified: true,
                    chainId: ChainId.Sui,
                    network: Network.Mainnet,
                },
                {
                    tokenId: TokenId.SuiMainnetUsdc,
                    decimals: 6,
                    symbol: "USDC",
                    name: "USD Coin",
                    address: "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC", // Sui Move object id
                    iconUrl: "/icons/tokens/usdc.svg",
                    type: TokenType.Stable,
                    verified: true,
                    unifiedTokenId: UnifiedTokenId.Usdc,
                    chainId: ChainId.Sui,
                    network: Network.Mainnet,
                },
            ],
            [Network.Testnet]: [
                {
                    tokenId: TokenId.SuiTestnetSui,
                    decimals: 9,
                    symbol: "SUI",
                    name: "Sui",
                    iconUrl: "/icons/tokens/sui.jpeg",
                    type: TokenType.Native,
                    verified: true,
                    chainId: ChainId.Sui,
                    network: Network.Testnet,
                },
            ],
        },

        [ChainId.Aptos]: {
            [Network.Mainnet]: [
                {
                    tokenId: TokenId.AptosMainnetApt,
                    decimals: 8,
                    symbol: "APT",
                    name: "Aptos",
                    iconUrl: "/icons/tokens/aptos.svg",
                    type: TokenType.Native,
                    verified: true,
                    chainId: ChainId.Aptos,
                    network: Network.Mainnet,
                },
                {
                    tokenId: TokenId.AptosMainnetUsdc,
                    decimals: 6,
                    symbol: "USDC",
                    name: "USD Coin",
                    address: "0x1::coin::USDC", // Aptos Move resource
                    iconUrl: "/icons/tokens/usdc.svg",
                    type: TokenType.Stable,
                    verified: true,
                    chainId: ChainId.Aptos,
                    network: Network.Testnet,
                },
            ],
            [Network.Testnet]: [
                {
                    tokenId: TokenId.AptosTestnetApt,
                    decimals: 8,
                    symbol: "APT",
                    name: "Aptos",
                    iconUrl: "/icons/tokens/aptos.svg",
                    type: TokenType.Native,
                    verified: true,
                    chainId: ChainId.Aptos,
                    network: Network.Mainnet,
                },
            ],
        },
    }
    private unifiedTokens: Array<UnifiedToken> = [
        {
            unifiedTokenId: UnifiedTokenId.Usdc,
            symbol: "USDC",
            name: "USD Coin",
            iconUrl: "/assets/tokens/usdc.svg",
        },
        {
            unifiedTokenId: UnifiedTokenId.Usdt,
            symbol: "USDT",
            name: "USD Tether",
            iconUrl: "/assets/tokens/usdt.svg",
        },
    ]

    constructor() {
        this.tokens = this.defaultTokens
    }

    public getUnifiedTokens(): Array<UnifiedToken> {
        return _.cloneDeep(this.unifiedTokens)
    }

    public getUnifiedTokenById(unifiedTokenId: UnifiedTokenId): UnifiedToken {
        const unifiedToken = _.cloneDeep(this.unifiedTokens.find((unifiedToken) => unifiedToken.unifiedTokenId === unifiedTokenId))
        if (!unifiedToken) {
            throw new Error(`Unified token with id ${unifiedTokenId} not found`)
        }
        return unifiedToken
    }

    public getTokens(tokens?: Record<ChainId, Record<Network, Array<Token>>>): Array<Token> {
        if (tokens) {
            this.tokens = _.cloneDeep(tokens)
        }
        const results: Array<Token> = []
        Object.values(this.tokens).flatMap((chain) => Object.values(chain).flat()).forEach((token) => {
            if (!results.some((tokenToCheck) => tokenToCheck.tokenId === token.tokenId)) {
                results.push(token)
            }
        })
        return results
    }

    public toObject(): Tokens {
        return _.cloneDeep(this.tokens)
    }

    public getTokensByChainIdAndNetwork(
        chainId: ChainId,
        network: Network,
    ): Array<Token> {
        return _.cloneDeep(this.tokens[chainId]?.[network] || [])
    }

    public getChainIdByTokenId(tokenId: TokenId): ChainId | undefined {
        for (const chainId of Object.keys(this.tokens) as Array<ChainId>) {
            for (const network of Object.keys(
                this.tokens[chainId] ?? {},
            ) as Array<Network>) {
                const token = _.cloneDeep(this.tokens[chainId]?.[network]?.find(
                    (token) => token.tokenId === tokenId,
                ))
                if (token) {
                    return chainId
                }
            }
        }
        return undefined
    }

    public getTokenById(
        tokenId: TokenId = TokenId.MonadTestnetMon,
    ): Token | undefined {
        for (const chainId of Object.keys(this.tokens) as Array<ChainId>) {
            for (const network of Object.keys(
                this.tokens[chainId] ?? {},
            ) as Array<Network>) {
                const token = this.tokens[chainId]?.[network]?.find(
                    (token) => token.tokenId === tokenId,
                )
                if (token) {
                    return token
                }
            }
        }
    }

    public getTokenByAddress(
        tokenAddress: string,
        chainId: ChainId,
        network: Network,
    ): Token | undefined {
        return (
            this.tokens[chainId]?.[network]?.find(
                (token) => token.address === tokenAddress,
            ) ||
      this.tokens[chainId]?.[network]?.find(
          (token) => token.tokenId === TokenId.MonadTestnetMon,
      )
        )
    }

    public getWrappedToken(
        chainId: ChainId,
        network: Network,
    ): Token | undefined {
        return this.tokens[chainId]?.[network]?.find(
            (token) => token.type === TokenType.Wrapped,
        )
    }

    public getNativeToken(chainId: ChainId, network: Network): Token | undefined {
        return this.tokens[chainId]?.[network]?.find(
            (token) => token.type === TokenType.Native,
        )
    }

    public injectIconUrl(options: {
        chainId?: ChainId
        network?: Network
        tokenId?: TokenId
        iconUrl: string
    }) {
        const { chainId, network, tokenId, iconUrl } = options
    
        // If a specific tokenId is provided → find that token across all chains/networks and update its iconUrl
        if (tokenId) {
            for (const chain of Object.keys(this.tokens) as Array<ChainId>) {
                for (const net of Object.keys(this.tokens[chain] ?? {}) as Array<Network>) {
                    const tokens = this.tokens[chain]?.[net]
                    const token = tokens?.find((t) => t.tokenId === tokenId)
                    if (token) {
                        token.iconUrl = iconUrl
                        return
                    }
                }
            }
            return
        }
    
        // If both chainId and network are provided → apply the new iconUrl to all tokens in that specific network
        if (chainId && network) {
            const tokens = this.tokens[chainId]?.[network]
            if (!tokens) return
            tokens.forEach((t) => (t.iconUrl = iconUrl))
            return
        }
    
        // If only chainId is provided → apply the new iconUrl to all tokens across all networks in that chain
        if (chainId && !network) {
            for (const net of Object.keys(this.tokens[chainId] ?? {}) as Array<Network>) {
                const tokens = this.tokens[chainId]?.[net]
                tokens?.forEach((t) => (t.iconUrl = iconUrl))
            }
            return
        }
    
        // If nothing is specified → inject iconUrl for every token in all chains/networks
        for (const chain of Object.keys(this.tokens) as Array<ChainId>) {
            for (const net of Object.keys(this.tokens[chain] ?? {}) as Array<Network>) {
                const tokens = this.tokens[chain]?.[net]
                tokens?.forEach((t) => (t.iconUrl = iconUrl))
            }
        }
    }
}
