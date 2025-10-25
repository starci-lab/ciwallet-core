import type { IWallet, Wallet } from "./IWallet"
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519"
import { Platform } from "@ciwallet-sdk/types"

export class SuiWallet implements IWallet {
    constructor() {}

    fromMnemonic(mnemonic: string, accountNumber = 0): Wallet {
        const account = Ed25519Keypair.deriveKeypair(mnemonic, `m/44'/784'/0'/0'/${accountNumber}'`)
        return {
            accountAddress: account.getPublicKey().toSuiAddress(),
            privateKey: account.getSecretKey(),
            publicKey: account.getPublicKey().toSuiPublicKey(),
            platform: Platform.Sui,
        }
    }

    fromPrivateKey(privateKey: string): Wallet {
        const account = Ed25519Keypair.fromSecretKey(privateKey)
        return {
            accountAddress: account.getPublicKey().toSuiAddress(),
            privateKey,
            publicKey: account.getPublicKey().toSuiPublicKey(),
            platform: Platform.Sui,
        }
    }
}