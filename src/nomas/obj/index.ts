import { 
    Encryption, 
    Mnemonic, 
    WalletGenerator,
    ProtocolManager,
    ImportedWalletGenerator,
    ExplorerManager,
    Hyperliquid,
    Hyperunit,
    InfoHyperliquid,
    SubscriptionHyperliquid,
    ExchangeHyperliquid,
    HyperliquidDeposit,
} from "@ciwallet-sdk/classes"

export * from "./token"
export * from "./chain"
export * from "./aggregator"
export * from "./hyperliquid"

export const subscriptionHyperliquidObj = new SubscriptionHyperliquid()
export const mnemonicObj = new Mnemonic()
export const walletGeneratorObj = new WalletGenerator()
export const encryptionObj = new Encryption()
export const protocolManagerObj = new ProtocolManager()
export const importedWalletGeneratorObj = new ImportedWalletGenerator()
export const hyperunitObj = new Hyperunit()
export const infoHyperliquidObj = new InfoHyperliquid()
export const exchangeHyperliquidObj = new ExchangeHyperliquid()
export const hyperliquidDepositObj = new HyperliquidDeposit()
export const explorerManagerObj = new ExplorerManager()