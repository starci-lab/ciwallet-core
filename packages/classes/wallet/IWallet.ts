import type { Platform } from "@ciwallet-sdk/types"

export interface IWallet {
    fromMnemonic(mnemonic: string, accountNumber?: number): Wallet
    fromPrivateKey(privateKey: string): Wallet
}

export interface Wallet {
    platform: Platform
    publicKey: string
    privateKey: string
    accountAddress: string
}