import type { ChainId, Network } from "./chain"

export enum TokenId {
  // --- Monad ---
  MonadMainnetMon = "monad_mainnet_mon",
  MonadMainnetWmon = "monad_mainnet_wmon",
  MonadMainnetUsdc = "monad_mainnet_usdc",

  MonadTestnetMon = "monad_testnet_mon",
  MonadTestnetWmon = "monad_testnet_wmon",
  MonadTestnetUsdc = "monad_testnet_usdc",

  // --- Solana ---
  SolanaMainnetSol = "solana_mainnet_sol",
  SolanaMainnetUsdc = "solana_mainnet_usdc",
  SolanaMainnet2Z = "solana_mainnet_2z",
  SolanaMainnetBonk = "solana_mainnet_bonk",
  SolanaMainnetFartcoin = "solana_mainnet_fartcoin",
  SolanaMainnetPump = "solana_mainnet_pump",
  SolanaMainnetSpx = "solana_mainnet_spx",

  SolanaTestnetSol = "solana_testnet_sol",
  SolanaTestnetUsdc = "solana_testnet_usdc",

  // --- Sui ---
  SuiMainnetSui = "sui_mainnet_sui",
  SuiMainnetUsdc = "sui_mainnet_usdc",

  SuiTestnetSui = "sui_testnet_sui",
  SuiTestnetUsdc = "sui_testnet_usdc",

  // --- Aptos ---
  AptosMainnetApt = "aptos_mainnet_apt",
  AptosMainnetUsdc = "aptos_mainnet_usdc",

  AptosTestnetApt = "aptos_testnet_apt",
  AptosTestnetUsdc = "aptos_testnet_usdc",

  // --- Arbitrum ---
  ArbitrumMainnetUsdc = "arbitrum_mainnet_usdc",
  ArbitrumMainnetNative = "arbitrum_mainnet_native",

  ArbitrumTestnetUsdc = "arbitrum_testnet_usdc",
  ArbitrumTestnetNative = "arbitrum_testnet_native",

  // --- Ethereum ---
  EthereumMainnetUsdc = "ethereum_mainnet_usdc",
  EthereumMainnetNative = "ethereum_mainnet_native",

  EthereumTestnetUsdc = "ethereum_testnet_usdc",
  EthereumTestnetNative = "ethereum_testnet_native",

  // --- Plasma ---
  PlasmaMainnetNative = "plasma_mainnet_native",
  PlasmaMainnetXpl = "plasma_mainnet_xpl",

  PlasmaTestnetNative = "plasma_testnet_native",
  
  // --- Bitcoin ---
  BitcoinMainnetNative = "bitcoin_mainnet_native",
  BitcoinTestnetNative = "bitcoin_testnet_native",
}

export enum UnifiedTokenId {
  Usdc = "usdc",
  Usdt = "usdt",
}

export enum TokenType {
  Native = "native",
  Stable = "stable",
  Wrapped = "wrapped",
  Standard = "standard",
}

export type ChainIdWithAllNetwork = ChainId | "all-network"

export interface Token {
  tokenId: TokenId;
  chainId: ChainId;
  network: Network;
  address?: string;
  decimals: number;
  symbol: string;
  name: string;
  iconUrl: string;
  type: TokenType;
  verified: boolean;
  pythId?: string;
  unifiedTokenId?: UnifiedTokenId;
  isToken2022?: boolean;
}

export interface UnifiedToken {
  unifiedTokenId: UnifiedTokenId;
  symbol: string;
  name: string;
  iconUrl: string;
  pythId?: string;
}