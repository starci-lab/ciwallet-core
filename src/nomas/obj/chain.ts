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