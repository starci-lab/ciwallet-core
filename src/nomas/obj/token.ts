import { TokenManager } from "@ciwallet-sdk/classes"
import { ChainId, Network, TokenId } from "@ciwallet-sdk/types"
import { assetsConfig } from "../resources/assets"

export const tokenManagerObj = new TokenManager()
// inject icon url for monad
// monad
tokenManagerObj.injectIconUrl({
    chainId: ChainId.Monad,
    network: Network.Mainnet,  
    tokenId: TokenId.MonadTestnetMon,
    iconUrl: assetsConfig().tokens.mon,
})
tokenManagerObj.injectIconUrl({
    chainId: ChainId.Monad,
    network: Network.Testnet,  
    tokenId: TokenId.MonadTestnetMon,
    iconUrl: assetsConfig().tokens.mon,
})

// wmon
tokenManagerObj.injectIconUrl({
    chainId: ChainId.Monad,
    network: Network.Testnet,  
    tokenId: TokenId.MonadTestnetWmon,
    iconUrl: assetsConfig().tokens.mon,
})
tokenManagerObj.injectIconUrl({
    chainId: ChainId.Monad,
    network: Network.Mainnet,  
    tokenId: TokenId.MonadTestnetWmon,
    iconUrl: assetsConfig().tokens.mon,
})

// usdc
tokenManagerObj.injectIconUrl({
    chainId: ChainId.Monad,
    network: Network.Testnet,  
    tokenId: TokenId.MonadTestnetUsdc,
    iconUrl: assetsConfig().tokens.usdc,
})
tokenManagerObj.injectIconUrl({
    chainId: ChainId.Monad,
    network: Network.Mainnet,  
    tokenId: TokenId.MonadTestnetUsdc,
    iconUrl: assetsConfig().tokens.usdc,
})

// aptos
tokenManagerObj.injectIconUrl({
    chainId: ChainId.Aptos,
    network: Network.Mainnet,  
    tokenId: TokenId.AptosMainnetApt,
    iconUrl: assetsConfig().tokens.aptos,
})
tokenManagerObj.injectIconUrl({
    chainId: ChainId.Aptos,
    network: Network.Testnet,  
    tokenId: TokenId.AptosTestnetApt,
    iconUrl: assetsConfig().tokens.aptos,
})