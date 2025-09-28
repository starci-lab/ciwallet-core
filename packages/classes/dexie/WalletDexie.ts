import Dexie, { type EntityTable } from "dexie"
import type { ChainId, Network } from "@ciwallet-sdk/types"

export interface WalletEntity {
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
    network: Network                // Network type (e.g. mainnet, testnet)
}

export interface MnemonicEntity {
    id?: number                     // Primary key (auto increment)
    encryptedMnemonic: string       // Mnemonic encrypted with AES
    createdAt: number               // Creation timestamp
    updatedAt: number               // Last updated timestamp
}

export const walletDb = new Dexie("WalletDB") as Dexie & {
  wallets: EntityTable<
    WalletEntity,
    "id" // Primary key type for WalletEntity
  >;
  mnemonics: EntityTable<
    MnemonicEntity,
    "id" // Primary key type for MnemonicEntity
  >;
}

export class WalletDexie extends Dexie {
    public wallets!: EntityTable<WalletEntity, "id">
    public mnemonics!: EntityTable<MnemonicEntity, "id">

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
                network,
                isSelected
            `,
            mnemonics: `
                ++id
            `,
        })
    }
}