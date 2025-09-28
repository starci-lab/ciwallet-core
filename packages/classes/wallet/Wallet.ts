import { Platform, type ChainId } from "@ciwallet-sdk/types"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"
import { EvmWallet } from "./EvmWallet"
import { SolanaWallet } from "./SolanaWallet"
import { SuiWallet } from "./SuiWallet"
import type { Wallet } from "./IWallet"

export interface GenerateWalletParams {
    mnemonic: string
    chainId: ChainId
}

export class WalletGenerator {
    constructor() {}

    generateWallet({
        mnemonic,
        chainId,
    }: GenerateWalletParams): Wallet {
        const platform = chainIdToPlatform(chainId)
        switch (platform) {
        case Platform.Solana:
            return new SolanaWallet().fromMnemonic(mnemonic, 0)
        case Platform.Sui:
            return new SuiWallet().fromMnemonic(mnemonic, 0)
        case Platform.Evm:
            return new EvmWallet().fromMnemonic(mnemonic, 0)
        }
        throw new Error(`Unsupported platform: ${platform}`)
    }   
}