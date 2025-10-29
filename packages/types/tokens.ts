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
}

export enum UnifiedTokenId {
  Usdc = "usdc",
  Usdt = "usdt",
}

export enum TokenType {
  Native = "native",
  Stable = "stable",
  Wrapped = "wrapped",
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