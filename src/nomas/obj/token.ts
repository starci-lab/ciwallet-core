import { TokenManager } from "@ciwallet-sdk/classes"
import { TokenId, UnifiedTokenId } from "@ciwallet-sdk/types"
import { assetsConfig } from "../resources/assets"

export const tokenManagerObj = new TokenManager()
//
// ========== MONAD ==========
// MON
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.MonadMainnetMon,
    iconUrl: assetsConfig().tokens.mon,
})
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.MonadTestnetMon,
    iconUrl: assetsConfig().tokens.mon,
})

// WMON
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.MonadMainnetWmon,
    iconUrl: assetsConfig().tokens.mon,
})
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.MonadTestnetWmon,
    iconUrl: assetsConfig().tokens.mon,
})

// USDC
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.MonadMainnetUsdc,
    iconUrl: assetsConfig().tokens.usdc,
})
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.MonadTestnetUsdc,
    iconUrl: assetsConfig().tokens.usdc,
})

//
// ========== APTOS ==========
// APT
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.AptosMainnetApt,
    iconUrl: assetsConfig().tokens.aptos,
})
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.AptosTestnetApt,
    iconUrl: assetsConfig().tokens.aptos,
})

// USDC
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.AptosMainnetUsdc,
    iconUrl: assetsConfig().tokens.usdc,
})
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.AptosTestnetUsdc,
    iconUrl: assetsConfig().tokens.usdc,
})

//
// ========== ETHEREUM ==========
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.EthereumMainnetNative,
    iconUrl: assetsConfig().tokens.eth,
})
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.EthereumTestnetNative,
    iconUrl: assetsConfig().tokens.eth,
})

tokenManagerObj.injectIconUrl({
    tokenId: TokenId.EthereumMainnetUsdc,
    iconUrl: assetsConfig().tokens.usdc,
})
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.EthereumTestnetUsdc,
    iconUrl: assetsConfig().tokens.usdc,
})

//
// ========== SOLANA ==========
// SOL
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.SolanaMainnetSol,
    iconUrl: assetsConfig().tokens.solana,
})
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.SolanaTestnetSol,
    iconUrl: assetsConfig().tokens.solana,
})

// USDC
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.SolanaMainnetUsdc,
    iconUrl: assetsConfig().tokens.usdc,
})
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.SolanaTestnetUsdc,
    iconUrl: assetsConfig().tokens.usdc,
})

// memecoins
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.SolanaMainnet2Z,
    iconUrl: assetsConfig().tokens["2z"],
})
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.SolanaMainnetBonk,
    iconUrl: assetsConfig().tokens.bonk,
})
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.SolanaMainnetFartcoin,
    iconUrl: assetsConfig().tokens.fartcoin,
})
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.SolanaMainnetPump,
    iconUrl: assetsConfig().tokens.pump,
})
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.SolanaMainnetSpx,
    iconUrl: assetsConfig().tokens.spx,
})

//
// ========== SUI ==========
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.SuiMainnetSui,
    iconUrl: assetsConfig().tokens.sui,
})
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.SuiTestnetSui,
    iconUrl: assetsConfig().tokens.sui,
})

tokenManagerObj.injectIconUrl({
    tokenId: TokenId.SuiMainnetUsdc,
    iconUrl: assetsConfig().tokens.usdc,
})
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.SuiTestnetUsdc,
    iconUrl: assetsConfig().tokens.usdc,
})

//
// ========== ARBITRUM ==========
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.ArbitrumMainnetNative,
    iconUrl: assetsConfig().tokens.eth,
})
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.ArbitrumTestnetNative,
    iconUrl: assetsConfig().tokens.eth,
})

tokenManagerObj.injectIconUrl({
    tokenId: TokenId.ArbitrumMainnetUsdc,
    iconUrl: assetsConfig().tokens.usdc,
})
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.ArbitrumTestnetUsdc,
    iconUrl: assetsConfig().tokens.usdc,
})

//
// ========== BITCOIN ==========
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.BitcoinMainnetNative,
    iconUrl: assetsConfig().tokens.btc,
})
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.BitcoinTestnetNative,
    iconUrl: assetsConfig().tokens.btc,
})

//
// ========== PLASMA ==========
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.PlasmaMainnetNative,
    iconUrl: assetsConfig().tokens.xpl,
})
tokenManagerObj.injectIconUrl({
    tokenId: TokenId.PlasmaTestnetNative,
    iconUrl: assetsConfig().tokens.xpl,
})


//
// ========== HYPERLIQUID ==========
tokenManagerObj.injectUnifiedIconUrl({
    unifiedTokenId: UnifiedTokenId.Usdc,
    iconUrl: assetsConfig().tokens.usdc,
})
tokenManagerObj.injectUnifiedIconUrl({
    unifiedTokenId: UnifiedTokenId.Usdt,
    iconUrl: assetsConfig().tokens.usdt,
})