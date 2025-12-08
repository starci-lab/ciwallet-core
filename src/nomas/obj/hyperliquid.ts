import { Hyperliquid, HyperliquidAssetId } from "@ciwallet-sdk/classes"
import { HyperliquidDepositAsset } from "@ciwallet-sdk/classes"
import { assetsConfig } from "../resources/assets"

export const hyperliquidObj = new Hyperliquid() 

hyperliquidObj.injectDepositAssetIconUrl({
    asset: HyperliquidDepositAsset.Bitcoin,
    iconUrl: assetsConfig().tokens.btc,
})
hyperliquidObj.injectDepositAssetIconUrl({
    asset: HyperliquidDepositAsset.Eth,
    iconUrl: assetsConfig().tokens.eth,
})
hyperliquidObj.injectDepositAssetIconUrl({
    asset: HyperliquidDepositAsset.Sol,
    iconUrl: assetsConfig().tokens.solana,
})  
hyperliquidObj.injectDepositAssetIconUrl({
    asset: HyperliquidDepositAsset.Usdc,
    iconUrl: assetsConfig().tokens.usdc,
})
hyperliquidObj.injectDepositAssetIconUrl({
    asset: HyperliquidDepositAsset.TwoZ,
    iconUrl: assetsConfig().tokens["2z"],
})
hyperliquidObj.injectDepositAssetIconUrl({
    asset: HyperliquidDepositAsset.Bonk,
    iconUrl: assetsConfig().tokens.bonk,
})
hyperliquidObj.injectDepositAssetIconUrl({
    asset: HyperliquidDepositAsset.Fartcoin,
    iconUrl: assetsConfig().tokens.fartcoin,
})
hyperliquidObj.injectDepositAssetIconUrl({
    asset: HyperliquidDepositAsset.Pump,
    iconUrl: assetsConfig().tokens.pump,
})
hyperliquidObj.injectDepositAssetIconUrl({
    asset: HyperliquidDepositAsset.Spx,
    iconUrl: assetsConfig().tokens.spx,
})
hyperliquidObj.injectDepositAssetIconUrl({
    asset: HyperliquidDepositAsset.Xpl,
    iconUrl: assetsConfig().tokens.xpl,
})
hyperliquidObj.injectAssetIconUrl({
    assetId: HyperliquidAssetId.BTC,
    iconUrl: assetsConfig().tokens.btc,
})
hyperliquidObj.injectAssetIconUrl({
    assetId: HyperliquidAssetId.ETH,
    iconUrl: assetsConfig().tokens.eth,
})
hyperliquidObj.injectAssetIconUrl({
    assetId: HyperliquidAssetId.SOL,
    iconUrl: assetsConfig().tokens.solana,
})