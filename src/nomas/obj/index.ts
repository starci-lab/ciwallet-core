import { 
    Encryption, 
    Mnemonic, 
    WalletGenerator,
    AggregatorManager,
    ProtocolManager
} from "@ciwallet-sdk/classes"
export * from "./token"
export * from "./chain"
import { envConfig } from "../env"

export const mnemonicObj = new Mnemonic()
export const walletGeneratorObj = new WalletGenerator()
export const encryptionObj = new Encryption()
export const protocolManagerObj = new ProtocolManager()

export const aggregatorManagerObj = new AggregatorManager({
    lifi: {
        integrator: envConfig().lifi.integrator,
        apiKey: envConfig().lifi.apiKey,
    },
})