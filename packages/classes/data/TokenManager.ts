import {
  ChainId,
  Network,
  type Token,
  TokenId,
  TokenType,
} from '@ciwallet-sdk/types';

export type Tokens = Partial<
  Record<ChainId, Partial<Record<Network, Array<Token>>>>
>;
export class TokenManager {
  private tokens: Tokens = {};
  private defaultTokens: Tokens = {
    [ChainId.Monad]: {
      [Network.Mainnet]: [
        {
          tokenId: TokenId.MonadTestnetMon,
          decimals: 18,
          symbol: 'MON',
          name: 'Monad',
          iconUrl: '/icons/tokens/mon.png',
          type: TokenType.Native,
          verified: true,
        },
        {
          tokenId: TokenId.MonadTestnetWmon,
          decimals: 18,
          symbol: 'WMON',
          name: 'Wrapped MON',
          iconUrl: '/icons/tokens/mon.png',
          address: '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701',
          type: TokenType.Wrapped,
          verified: true,
        },
        {
          tokenId: TokenId.MonadTestnetUsdc,
          decimals: 6,
          symbol: 'USDC',
          name: 'USD Coin',
          address: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
          iconUrl: '/icons/tokens/usdc.svg',
          type: TokenType.Stable,
          verified: true,
        },
      ],
      [Network.Testnet]: [
        {
          tokenId: TokenId.MonadTestnetMon,
          decimals: 18,
          symbol: 'MON',
          name: 'Monad',
          iconUrl: '/icons/tokens/mon.png',
          type: TokenType.Native,
          verified: true,
        },
        {
          tokenId: TokenId.MonadTestnetWmon,
          decimals: 18,
          symbol: 'WMON',
          name: 'Wrapped MON',
          iconUrl: '/icons/tokens/mon.png',
          address: '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701',
          type: TokenType.Wrapped,
          verified: true,
        },
        {
          tokenId: TokenId.MonadTestnetUsdc,
          decimals: 6,
          symbol: 'USDC',
          name: 'USD Coin',
          address: '0xf817257fed379853cDe0fa4F97AB987181B1E5Ea',
          iconUrl: '/icons/tokens/usdc.svg',
          type: TokenType.Stable,
          verified: true,
        },
      ],
    },

    [ChainId.Solana]: {
      [Network.Mainnet]: [
        {
          tokenId: TokenId.SolanaMainnetSol,
          decimals: 9,
          symbol: 'SOL',
          name: 'Solana',
          iconUrl: '/icons/tokens/solana.png',
          type: TokenType.Native,
          verified: true,
        },
        {
          tokenId: TokenId.SolanaMainnetUsdc,
          decimals: 6,
          symbol: 'USDC',
          name: 'USD Coin',
          address: 'So11111111111111111111111111111111111111112', // example
          iconUrl: '/icons/tokens/usdc.svg',
          type: TokenType.Stable,
          verified: true,
        },
      ],
      [Network.Testnet]: [
        {
          tokenId: TokenId.SolanaTestnetSol,
          decimals: 9,
          symbol: 'SOL',
          name: 'Solana',
          iconUrl: '/icons/tokens/solana.png',
          type: TokenType.Native,
          verified: true,
        },
      ],
    },

    [ChainId.Sui]: {
      [Network.Mainnet]: [
        {
          tokenId: TokenId.SuiMainnetSui,
          decimals: 9,
          symbol: 'SUI',
          name: 'Sui',
          iconUrl: '/icons/tokens/sui.jpeg',
          type: TokenType.Native,
          verified: true,
        },
        {
          tokenId: TokenId.SuiMainnetUsdc,
          decimals: 6,
          symbol: 'USDC',
          name: 'USD Coin',
          address: '0x2::coin::USDC', // Sui Move object id
          iconUrl: '/icons/tokens/usdc.svg',
          type: TokenType.Stable,
          verified: true,
        },
      ],
      [Network.Testnet]: [
        {
          tokenId: TokenId.SuiTestnetSui,
          decimals: 9,
          symbol: 'SUI',
          name: 'Sui',
          iconUrl: '/icons/tokens/sui.jpeg',
          type: TokenType.Native,
          verified: true,
        },
      ],
    },

    [ChainId.Aptos]: {
      [Network.Mainnet]: [
        {
          tokenId: TokenId.AptosMainnetApt,
          decimals: 8,
          symbol: 'APT',
          name: 'Aptos',
          iconUrl: '/icons/tokens/aptos.svg',
          type: TokenType.Native,
          verified: true,
        },
        {
          tokenId: TokenId.AptosMainnetUsdc,
          decimals: 6,
          symbol: 'USDC',
          name: 'USD Coin',
          address: '0x1::coin::USDC', // Aptos Move resource
          iconUrl: '/icons/tokens/usdc.svg',
          type: TokenType.Stable,
          verified: true,
        },
      ],
      [Network.Testnet]: [
        {
          tokenId: TokenId.AptosTestnetApt,
          decimals: 8,
          symbol: 'APT',
          name: 'Aptos',
          iconUrl: '/icons/tokens/aptos.svg',
          type: TokenType.Native,
          verified: true,
        },
      ],
    },
  };
  constructor() {
    this.tokens = this.defaultTokens;
  }

  public toObject(): Tokens {
    return this.tokens;
  }

  public getTokensByChainIdAndNetwork(
    chainId: ChainId,
    network: Network,
  ): Array<Token> {
    return this.tokens[chainId]?.[network] || [];
  }

  public getChainIdByTokenId(tokenId: TokenId): ChainId | undefined {
    for (const chainId of Object.keys(this.tokens) as Array<ChainId>) {
      for (const network of Object.keys(
        this.tokens[chainId] ?? {},
      ) as Array<Network>) {
        const token = this.tokens[chainId]?.[network]?.find(
          (token) => token.tokenId === tokenId,
        );
        if (token) {
          return chainId;
        }
      }
    }
    return undefined;
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
        );
        if (token) {
          return token;
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
    );
  }

  public getWrappedToken(
    chainId: ChainId,
    network: Network,
  ): Token | undefined {
    return this.tokens[chainId]?.[network]?.find(
      (token) => token.type === TokenType.Wrapped,
    );
  }

  public getNativeToken(chainId: ChainId, network: Network): Token | undefined {
    return this.tokens[chainId]?.[network]?.find(
      (token) => token.type === TokenType.Native,
    );
  }
}
