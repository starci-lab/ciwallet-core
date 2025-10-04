import { 
    Encryption, 
    Mnemonic, 
    TokenManager, 
    WalletGenerator,
    ChainManager,
    AggregatorManager
} from "@ciwallet-sdk/classes"

export const mnemonicObj = new Mnemonic()
export const walletGeneratorObj = new WalletGenerator()
export const encryptionObj = new Encryption()
export const tokenManagerObj = new TokenManager()
export const aggregatorManagerObj = new AggregatorManager()
export const chainManagerObj = new ChainManager()