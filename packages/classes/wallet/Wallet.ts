import { Platform } from "@ciwallet-sdk/types"
import { EvmWallet } from "./EvmWallet"
import { SolanaWallet } from "./SolanaWallet"
import { SuiWallet } from "./SuiWallet"
import { AptosWallet } from "./AptosWallet"
import type { Wallet } from "./IWallet"
import { Encryption } from "../crypto"

export interface GenerateWalletParams {
    mnemonic: string
    platform: Platform
    password: string
    index: number
}

export interface GenerateWalletsParams {
    mnemonic: string
    platforms?: Array<Platform>
    password: string
    index: number
}

export class WalletGenerator {
    private encryption: Encryption
    constructor() {
        this.encryption = new Encryption()
    }

    async generateWallet({
        mnemonic,
        platform,
        password,
        index,
    }: GenerateWalletParams): Promise<Wallet> {
        switch (platform) {
        case Platform.Solana: {
            const solanaWallet = new SolanaWallet().fromMnemonic(mnemonic, index)
            return {
                ...solanaWallet,
                privateKey: await this.encryption.encrypt(solanaWallet.privateKey, password),
            }
        }
        case Platform.Aptos: {
            const aptosWallet = new AptosWallet().fromMnemonic(mnemonic, index)
            return {
                ...aptosWallet,
                privateKey: await this.encryption.encrypt(aptosWallet.privateKey, password),
            }
        }
        case Platform.Sui: {
            const suiWallet = new SuiWallet().fromMnemonic(mnemonic, index)
            return {
                ...suiWallet,
                privateKey: await this.encryption.encrypt(suiWallet.privateKey, password),
            }
        }
        case Platform.Evm: {
            const evmWallet = new EvmWallet().fromMnemonic(mnemonic, index)
            return {
                ...evmWallet,
                privateKey: await this.encryption.encrypt(evmWallet.privateKey, password),
            }
        }
        default: {
            throw new Error(`Unsupported platform: ${platform}`)
        }
        }
    }

    async generateWallets({
        mnemonic,
        platforms,
        password,
        index,
    }: GenerateWalletsParams): Promise<Record<Platform, Wallet>> {
        platforms = platforms ?? Object.values(Platform)
        const wallets: Partial<Record<Platform, Wallet>> = {}
        await Promise.all(platforms.map(async (platform) => {
            const wallet = await this.generateWallet({ mnemonic, platform, password, index })
            wallets[platform] = wallet
        }))
        return wallets as Record<Platform, Wallet>
    }
}

export interface GenerateImportedWalletParams {
    privateKey: string
    platform: Platform
}

export class ImportedWalletGenerator {
    private encryption: Encryption
    constructor() {
        this.encryption = new Encryption()
    }

    async generateWallet({
        privateKey,
        platform,
    }: GenerateImportedWalletParams): Promise<Wallet> {
        switch (platform) {
        case Platform.Solana: {
            const solanaWallet = new SolanaWallet().fromPrivateKey(privateKey)
            return {
                ...solanaWallet,
            }
        }
        case Platform.Aptos: {
            const aptosWallet = new AptosWallet().fromPrivateKey(privateKey)
            return {
                ...aptosWallet,
            }
        }
        case Platform.Sui: {
            const suiWallet = new SuiWallet().fromPrivateKey(privateKey)
            return {
                ...suiWallet,
            }
        }
        case Platform.Evm: {
            const evmWallet = new EvmWallet().fromPrivateKey(privateKey)
            return {
                ...evmWallet,
            }
        }
        default: {
            throw new Error(`Unsupported platform: ${platform}`)
        }
        }
    }
}