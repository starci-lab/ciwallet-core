import type { IWallet, Wallet } from "./IWallet"
import { Ed25519Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk"
import { Platform } from "@ciwallet-sdk/types"

export class AptosWallet implements IWallet {
    constructor() {}
    fromMnemonic(mnemonic: string, accountNumber = 0): Wallet {
        // BIP-44 path for Aptos: m/44'/637'/0'/0'/index'
        const path = `m/44'/637'/0'/0'/${accountNumber}'`
        const account = Ed25519Account.fromDerivationPath({
            mnemonic,
            path,
        })

        return {
            accountAddress: account.accountAddress.toString(),
            privateKey: account.privateKey.toString(),
            publicKey: account.publicKey.toString(),
            platform: Platform.Aptos,
        }
    }

    fromPrivateKey(privateKey: string): Wallet {
        const account = new Ed25519PrivateKey(privateKey)
        return {
            accountAddress: account.publicKey().toString(),
            privateKey,
            publicKey: account.publicKey().toString(),
            platform: Platform.Aptos,
        }
    }
}