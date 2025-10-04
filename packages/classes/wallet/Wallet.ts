import { Platform, type ChainId } from "@ciwallet-sdk/types"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"
import { EvmWallet } from "./EvmWallet"
import { SolanaWallet } from "./SolanaWallet"
import { SuiWallet } from "./SuiWallet"
import type { Wallet } from "./IWallet"
import { Encryption } from "../crypto"

export interface GenerateWalletParams {
    mnemonic: string
    chainId: ChainId
    password: string
}

export interface GenerateWalletsParams {
    mnemonic: string
    chainIds: Array<ChainId>
    password: string
}

export class WalletGenerator {
    private encryption: Encryption
    constructor() {
        this.encryption = new Encryption()
    }

    async generateWallet({
        mnemonic,
        chainId,
        password,
    }: GenerateWalletParams): Promise<Wallet> {
        const platform = chainIdToPlatform(chainId)
        switch (platform) {
        case Platform.Solana: {
            const solanaWallet = new SolanaWallet().fromMnemonic(mnemonic, 0)
            return {
                ...solanaWallet,
                privateKey: await this.encryption.encrypt(solanaWallet.privateKey, password),
            }
        }
        case Platform.Sui: {
            const suiWallet = new SuiWallet().fromMnemonic(mnemonic, 0)
            return {
                ...suiWallet,
                privateKey: await this.encryption.encrypt(suiWallet.privateKey, password),
            }
        }
        case Platform.Evm: {
            const evmWallet = new EvmWallet().fromMnemonic(mnemonic, 0)
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
        chainIds,
        password,
    }: GenerateWalletsParams): Promise<Array<Wallet>> {
        const wallets: Array<Wallet> = []
        await Promise.all(chainIds.map(async (chainId) => {
            const wallet = await this.generateWallet({ mnemonic, chainId, password })
            wallets.push(wallet)
        }))
        return wallets
    }
}