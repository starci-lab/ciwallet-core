import { 
    Encryption, 
    Mnemonic, 
    WalletGenerator,
    AggregatorManager
} from "@ciwallet-sdk/classes"
export * from "./token"
export * from "./chain"

export const mnemonicObj = new Mnemonic()
export const walletGeneratorObj = new WalletGenerator()
export const encryptionObj = new Encryption()

export const aggregatorManagerObj = new AggregatorManager()