export interface IWallet {
    fromMnemonic(mnemonic: string, accountNumber?: number): Wallet
}

export interface Wallet {
    publicKey: string
    privateKey: string
    accountAddress: string
}