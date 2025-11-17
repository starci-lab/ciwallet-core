import { APTOS_COIN } from "@aptos-labs/ts-sdk"
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
                    tokenId: TokenId.MonadMainnetMon,
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
                    tokenId: TokenId.MonadMainnetWmon,
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
                    tokenId: TokenId.MonadMainnetUsdc,
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
                    network: Network.Mainnet,
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
                    iconUrl: "/assets/tokens/solana.png",
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
                    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // example
                    iconUrl: "/assets/tokens/usdc.svg",
                    type: TokenType.Stable,
                    verified: true,
                    pythId: "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
                    unifiedTokenId: UnifiedTokenId.Usdc,
                    chainId: ChainId.Solana,
                    network: Network.Mainnet,
                },
                {
                    tokenId: TokenId.SolanaMainnet2Z,
                    decimals: 8,
                    symbol: "2Z",
                    name: "2Z",
                    iconUrl: "/assets/tokens/2z.svg",
                    type: TokenType.Standard,
                    verified: true,
                    pythId: "J6pQQ3FAcJQeWPPGppWRb4nM8jU3wLyYbRrLh7feMfvd",
                    chainId: ChainId.Solana,
                    network: Network.Mainnet,
                },
                {
                    tokenId: TokenId.SolanaMainnetBonk,
                    decimals: 5,
                    symbol: "BONK",
                    name: "Bonk",
                    iconUrl: "/assets/tokens/bonk.svg",
                    type: TokenType.Standard,
                    address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
                    verified: true,
                    pythId: "0x72b021217ca3fe68922a19aaf990109cb9d84e9ad004b4d2025ad6f529314419",
                    chainId: ChainId.Solana,
                    network: Network.Mainnet,
                },
                {
                    tokenId: TokenId.SolanaMainnetFartcoin,
                    decimals: 6,
                    symbol: "FARTCOIN",
                    name: "Fartcoin",
                    iconUrl: "/assets/tokens/fartcoin.svg",
                    type: TokenType.Standard,
                    address: "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump",
                    chainId: ChainId.Solana,
                    network: Network.Mainnet,
                    verified: true,
                    pythId: "0x58cd29ef0e714c5affc44f269b2c1899a52da4169d7acc147b9da692e6953608",
                },
                {
                    tokenId: TokenId.SolanaMainnetPump,
                    decimals: 6,
                    symbol: "PUMP",
                    address: "pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn",
                    name: "Pump.fun",
                    iconUrl: "/assets/tokens/pump.svg",
                    type: TokenType.Standard,
                    verified: true,
                    pythId: "0x7a01fca212788bba7c5bf8c9efd576a8a722f070d2c17596ff7bb609b8d5c3b9",
                    chainId: ChainId.Solana,
                    network: Network.Mainnet,
                },
                {
                    tokenId: TokenId.SolanaMainnetSpx,
                    decimals: 6,
                    symbol: "SPX",
                    name: "SPX6900",
                    iconUrl: "/assets/tokens/spx.svg",
                    type: TokenType.Standard,
                    address: "J3NKxxXZcnNiMjKw9hYb2K4LUxgwB6t1FtPtQVsv3KFr",
                    chainId: ChainId.Solana,
                    network: Network.Mainnet,
                    verified: true,
                    pythId: "0x8414cfadf82f6bed644d2e399c11df21ec0131aa574c56030b132113dbbf3a0a",
                },
            ],
            [Network.Testnet]: [
                {
                    tokenId: TokenId.SolanaTestnetSol,
                    decimals: 9,
                    symbol: "SOL",
                    name: "Solana",
                    iconUrl: "/assets/tokens/solana.png",
                    type: TokenType.Native,
                    verified: true,
                    chainId: ChainId.Solana,
                    network: Network.Testnet,
                    pythId: "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d",
                },
                {
                    tokenId: TokenId.SolanaTestnetUsdc,
                    decimals: 6,
                    symbol: "USDC",
                    name: "USD Coin",
                    iconUrl: "/assets/tokens/usdc.svg",
                    type: TokenType.Stable,
                    verified: true,
                    pythId: "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
                    unifiedTokenId: UnifiedTokenId.Usdc,
                    address: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
                    chainId: ChainId.Solana,
                    network: Network.Testnet,
                },
            ],
        },
        [ChainId.Ethereum]: {
            [Network.Mainnet]: [
                {
                    tokenId: TokenId.EthereumMainnetNative,
                    decimals: 18,
                    symbol: "ETH",
                    name: "Ethereum",
                    iconUrl: "/assets/tokens/ethereum.png",
                    type: TokenType.Native,
                    verified: true,
                    chainId: ChainId.Ethereum,
                    network: Network.Mainnet,
                    pythId: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
                },
                {
                    tokenId: TokenId.EthereumMainnetUsdc,
                    decimals: 6,
                    symbol: "USDC",
                    name: "USD Coin",
                    iconUrl: "/assets/tokens/usdc.svg",
                    type: TokenType.Stable,
                    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                    verified: true,
                    unifiedTokenId: UnifiedTokenId.Usdc,
                    chainId: ChainId.Ethereum,
                    network: Network.Mainnet,
                    pythId: "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
                },
            ],
            [Network.Testnet]: [
                {
                    tokenId: TokenId.EthereumTestnetNative,
                    decimals: 18,
                    symbol: "ETH",
                    name: "Ethereum",
                    iconUrl: "/assets/tokens/ethereum.png",
                    type: TokenType.Native,
                    verified: true,
                    chainId: ChainId.Ethereum,
                    network: Network.Testnet,
                    pythId: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
                },
                {
                    tokenId: TokenId.EthereumTestnetUsdc,
                    decimals: 6,
                    symbol: "USDC",
                    name: "USD Coin",
                    iconUrl: "/assets/tokens/usdc.svg",
                    type: TokenType.Stable,
                    verified: true,
                    address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238 ",
                    unifiedTokenId: UnifiedTokenId.Usdc,
                    chainId: ChainId.Ethereum,
                    network: Network.Testnet,
                    pythId: "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
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
                    address: "0x2::sui::SUI",
                    iconUrl: "/assets/tokens/sui.jpeg",
                    type: TokenType.Native,
                    verified: true,
                    chainId: ChainId.Sui,
                    network: Network.Mainnet,
                    pythId: "0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744",
                },
                {
                    tokenId: TokenId.SuiMainnetUsdc,
                    decimals: 6,
                    symbol: "USDC",
                    name: "USD Coin",
                    address: "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC", // Sui Move object id
                    pythId: "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
                    iconUrl: "/assets/tokens/usdc.svg",
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
                    address: "0x2::sui::SUI",
                    iconUrl: "/assets/tokens/sui.jpeg",
                    type: TokenType.Native,
                    verified: true,
                    chainId: ChainId.Sui,
                    network: Network.Testnet,
                    pythId: "0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744",
                },
                {
                    tokenId: TokenId.SuiTestnetUsdc,
                    decimals: 6,
                    symbol: "USDC",
                    name: "USD Coin",
                    iconUrl: "/assets/tokens/usdc.svg",
                    type: TokenType.Stable,
                    verified: true,
                    address: "0xa1ec7fc00a6f40db9693ad1415d0c193ad3906494428cf252621037bd7117e29::usdc::USDC",
                    pythId: "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
                    unifiedTokenId: UnifiedTokenId.Usdc,
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
                    address: APTOS_COIN, // Aptos Move resource
                    iconUrl: "/assets/tokens/aptos.png",
                    type: TokenType.Native,
                    verified: true,
                    chainId: ChainId.Aptos,
                    network: Network.Mainnet,
                    pythId: "0x03ae4db29ed4ae33d323568895aa00337e658e348b37509f5372ae51f0af00d5",
                },
                {
                    tokenId: TokenId.AptosMainnetUsdc,
                    decimals: 6,
                    symbol: "USDC",
                    name: "USD Coin",
                    address: "0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832", // Aptos Move resource
                    iconUrl: "/assets/tokens/usdc.svg",
                    type: TokenType.Stable,
                    verified: true,
                    chainId: ChainId.Aptos,
                    network: Network.Testnet,
                    unifiedTokenId: UnifiedTokenId.Usdc,
                    pythId: "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
                },
            ],
            [Network.Testnet]: [
                {
                    tokenId: TokenId.AptosTestnetApt,
                    decimals: 8,
                    symbol: "APT",
                    name: "Aptos",
                    address: APTOS_COIN, // Aptos Move resource
                    iconUrl: "/assets/tokens/aptos.png",
                    type: TokenType.Native,
                    verified: true,
                    chainId: ChainId.Aptos,
                    network: Network.Testnet,
                    pythId: "0x03ae4db29ed4ae33d323568895aa00337e658e348b37509f5372ae51f0af00d5",
                },
                {
                    tokenId: TokenId.AptosTestnetUsdc,
                    decimals: 6,
                    symbol: "USDC",
                    name: "USD Coin",
                    address: "0x69091fbab5f7d635ee7ac5098cf0c1efbe31d68fec0f2cd565e8d168daf52832", // Aptos Move resource
                    iconUrl: "/assets/tokens/usdc.svg",
                    type: TokenType.Native,
                    verified: true,
                    chainId: ChainId.Aptos,
                    unifiedTokenId: UnifiedTokenId.Usdc,
                    network: Network.Testnet,
                    pythId: "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
                },
            ],
        },
        [ChainId.Arbitrum]: {
            [Network.Mainnet]: [
                {
                    tokenId: TokenId.ArbitrumMainnetUsdc,
                    decimals: 6,
                    symbol: "USDC",
                    name: "USD Coin",
                    address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
                    iconUrl: "/assets/tokens/usdc.svg",
                    type: TokenType.Stable,
                    verified: true,
                    chainId: ChainId.Arbitrum,
                    network: Network.Mainnet,
                    pythId: "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
                },
                {
                    tokenId: TokenId.ArbitrumMainnetNative,
                    decimals: 18,
                    symbol: "ETH",
                    name: "Ethereum",
                    iconUrl: "/assets/tokens/ethereum.png",
                    type: TokenType.Native,
                    verified: true,
                    chainId: ChainId.Arbitrum,
                    network: Network.Mainnet,
                    pythId: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
                },
            ],
            [Network.Testnet]: [
                {
                    tokenId: TokenId.ArbitrumTestnetUsdc,
                    decimals: 6,
                    symbol: "USDC",
                    name: "USD Coin",
                    address: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
                    iconUrl: "/assets/tokens/usdc.svg",
                    type: TokenType.Stable,
                    verified: true,
                    chainId: ChainId.Arbitrum,
                    network: Network.Testnet,
                    pythId: "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
                    unifiedTokenId: UnifiedTokenId.Usdc,
                },
                {
                    tokenId: TokenId.ArbitrumTestnetNative,
                    decimals: 18,
                    symbol: "ETH",
                    name: "Ethereum",
                    iconUrl: "/assets/tokens/ethereum.png",
                    type: TokenType.Native,
                    verified: true,
                    chainId: ChainId.Arbitrum,
                    network: Network.Testnet,
                    pythId: "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
                },
            ],
        },
        [ChainId.Bitcoin]: {
            [Network.Mainnet]: [
                {
                    tokenId: TokenId.BitcoinMainnetNative,
                    decimals: 8,
                    symbol: "BTC",
                    name: "Bitcoin",
                    iconUrl: "/assets/tokens/bitcoin.svg",
                    type: TokenType.Native,
                    verified: true,
                    chainId: ChainId.Bitcoin,
                    network: Network.Mainnet,
                    pythId: "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
                },
            ],
            [Network.Testnet]: [
                {
                    tokenId: TokenId.BitcoinTestnetNative,
                    decimals: 8,
                    symbol: "BTC",
                    name: "Bitcoin",
                    iconUrl: "/assets/tokens/bitcoin.svg",
                    type: TokenType.Native,
                    verified: true,
                    chainId: ChainId.Bitcoin,
                    network: Network.Testnet,
                    pythId: "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
                },
            ],
        },
        [ChainId.Plasma]: {
            [Network.Mainnet]: [
                {
                    tokenId: TokenId.PlasmaMainnetNative,
                    decimals: 18,
                    symbol: "XPL",
                    name: "Plasma",
                    iconUrl: "/assets/tokens/xpl.jpg",
                    type: TokenType.Native,
                    verified: true,
                    chainId: ChainId.Plasma,
                    network: Network.Mainnet,
                    pythId: "0x9873512f5cb33c77ad7a5af098d74812c62111166be395fd0941c8cedb9b00d4",
                },
            ],
            [Network.Testnet]: [
                {
                    tokenId: TokenId.PlasmaTestnetNative,
                    decimals: 18,
                    symbol: "XPL",
                    name: "Plasma",
                    iconUrl: "/assets/tokens/xpl.jpg",
                    type: TokenType.Native,
                    verified: true,
                    chainId: ChainId.Plasma,
                    network: Network.Testnet,
                },
            ],
        },
    } as Tokens
    private unifiedTokens: Array<UnifiedToken> = [
        {
            unifiedTokenId: UnifiedTokenId.Usdc,
            symbol: "USDC",
            name: "USD Coin",
            iconUrl: "/assets/tokens/usdc.svg",
            pythId: "0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a",
        },
        {
            unifiedTokenId: UnifiedTokenId.Usdt,
            symbol: "USDT",
            name: "USD Tether",
            iconUrl: "/assets/tokens/usdt.svg",
            pythId: "0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b",
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
