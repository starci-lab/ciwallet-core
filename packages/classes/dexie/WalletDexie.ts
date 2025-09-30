import Dexie, { type EntityTable } from "dexie"
import type { ChainId } from "@ciwallet-sdk/types"

export interface WalletSchema {
    id?: number                     // Primary key (auto increment)
    name: string                    // Wallet name
    address: string                 // Wallet address
    publicKey: string               // Wallet public key
    iconBlob: Blob                  // Wallet icon as a Blob
    encryptedPrivateKey: string     // Private key encrypted with AES
    createdAt: number               // Creation timestamp
    updatedAt: number               // Last updated timestamp
    isSelected: boolean             // Whether this wallet is currently selected
    chainId: ChainId                // Chain ID (e.g. Sui Mainnet, Solana Devnet)
}

export interface MnemonicSchema {
    id?: number                     // Primary key (auto increment)
    encryptedMnemonic: string       // Mnemonic encrypted with AES
    createdAt: number               // Creation timestamp
    updatedAt: number               // Last updated timestamp
}

export class WalletDexie extends Dexie {
    public wallets!: EntityTable<WalletSchema, "id">
    public mnemonics!: EntityTable<MnemonicSchema, "id">

    constructor(
        dbName: string, 
        version = 1
    ) {
        super(dbName)

        this.version(version).stores({
            wallets: `
                ++id,
                address,
                name,
                chainId,
                isSelected
            `,
            mnemonics: `
                ++id
            `,
        })
    }
}