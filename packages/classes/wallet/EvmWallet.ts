import type { IWallet, Wallet } from "./IWallet"
import { ethers } from "ethers"
import { Platform } from "@ciwallet-sdk/types"

export class EvmWallet implements IWallet {
    constructor() {}

    fromMnemonic(mnemonic: string, accountNumber = 0): Wallet {
        const account = ethers.HDNodeWallet.fromPhrase(
            mnemonic, "", `m/44'/60'/0'/0/${accountNumber}`  
        )
        return {
            accountAddress: account.address,
            privateKey: account.privateKey,
            publicKey: account.publicKey,
            platform: Platform.Evm,
        }
    }

    fromPrivateKey(privateKey: string): Wallet {
        const account = new ethers.Wallet(privateKey)
        return {
            accountAddress: account.address,
            privateKey,
            publicKey: account.address,
            platform: Platform.Evm,
        }
    }
}