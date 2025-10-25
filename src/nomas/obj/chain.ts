import { ChainManager } from "@ciwallet-sdk/classes"
import { ChainId } from "@ciwallet-sdk/types"
import { assetsConfig } from "../resources/assets"

export const chainManagerObj = new ChainManager()
// inject icon url for monad
chainManagerObj.injectIconUrl({
    chainId: ChainId.Monad,
    iconUrl: assetsConfig().chains.monad.iconUrl,
    iconInvertedUrl: assetsConfig().chains.monad.iconInvertedUrl,
})
chainManagerObj.injectIconUrl({
    chainId: ChainId.Aptos,
    iconUrl: assetsConfig().chains.aptos.iconUrl,
    iconInvertedUrl: assetsConfig().chains.aptos.iconInvertedUrl,
})
chainManagerObj.injectIconUrl({
    chainId: ChainId.Solana,
    iconUrl: assetsConfig().chains.solana.iconUrl,
    iconInvertedUrl: assetsConfig().chains.solana.iconInvertedUrl,
})
chainManagerObj.injectIconUrl({
    chainId: ChainId.Sui,
    iconUrl: assetsConfig().chains.sui.iconUrl,
    iconInvertedUrl: assetsConfig().chains.sui.iconInvertedUrl,
})
chainManagerObj.injectIconUrl({
    chainId: ChainId.Bsc,
    iconUrl: assetsConfig().chains.bsc.iconUrl,
    iconInvertedUrl: assetsConfig().chains.bsc.iconInvertedUrl,
})
chainManagerObj.injectIconUrl({
    chainId: ChainId.Polygon,
    iconUrl: assetsConfig().chains.polygon.iconUrl,
    iconInvertedUrl: assetsConfig().chains.polygon.iconInvertedUrl,
})
chainManagerObj.injectIconUrl({ 
    chainId: ChainId.Ethereum,
    iconUrl: assetsConfig().chains.ethereum.iconUrl,
    iconInvertedUrl: assetsConfig().chains.ethereum.iconInvertedUrl,
})
chainManagerObj.injectIconUrl({
    chainId: ChainId.Avalanche,
    iconUrl: assetsConfig().chains.avalanche.iconUrl,
    iconInvertedUrl: assetsConfig().chains.avalanche.iconInvertedUrl,
})
chainManagerObj.injectIconUrl({
    chainId: ChainId.Fantom,
    iconUrl: assetsConfig().chains.fantom.iconUrl,
    iconInvertedUrl: assetsConfig().chains.fantom.iconInvertedUrl,
})
chainManagerObj.injectIconUrl({
    chainId: ChainId.Arbitrum,
    iconUrl: assetsConfig().chains.arbitrum.iconUrl,
    iconInvertedUrl: assetsConfig().chains.arbitrum.iconInvertedUrl,
})
chainManagerObj.injectIconUrl({
    chainId: ChainId.Base,
    iconUrl: assetsConfig().chains.base.iconUrl,
    iconInvertedUrl: assetsConfig().chains.base.iconInvertedUrl,
})