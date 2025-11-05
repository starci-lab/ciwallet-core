import { 
    Encryption, 
    Mnemonic, 
    WalletGenerator,
    AggregatorManager,
    ProtocolManager,
    ImportedWalletGenerator,
    ExplorerManager,
    Hyperliquid,
    Hyperunit
} from "@ciwallet-sdk/classes"
export * from "./token"
export * from "./chain"
import { envConfig } from "../env"

export const mnemonicObj = new Mnemonic()
export const walletGeneratorObj = new WalletGenerator()
export const encryptionObj = new Encryption()
export const protocolManagerObj = new ProtocolManager()
export const importedWalletGeneratorObj = new ImportedWalletGenerator()
export const hyperliquidObj = new Hyperliquid() 
export const hyperunitObj = new Hyperunit()
export const aggregatorManagerObj = new AggregatorManager({
    lifi: {
        integrator: envConfig().lifi.integrator,
        apiKey: envConfig().lifi.apiKey,
    },
})

export const explorerManagerObj = new ExplorerManager()