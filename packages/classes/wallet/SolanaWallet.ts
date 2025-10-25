import { Keypair } from "@solana/web3.js"
import type { IWallet, Wallet } from "./IWallet"
import { Mnemonic } from "./Mnemonic"
import base58 from "bs58"
import { sha512 } from "@noble/hashes/sha512"
import { Platform } from "@ciwallet-sdk/types"

export class SolanaWallet implements IWallet {
    private mnemonic: Mnemonic

    constructor() {
        this.mnemonic = new Mnemonic()
    }

    fromMnemonic(mnemonic: string, accountNumber = 0): Wallet {
        const seed = this.mnemonic.toSeed(mnemonic)

        const accountSeed = this.deriveAccountSeed(seed, accountNumber)

        const seed32 = accountSeed.slice(0, 32)
        const keypair = Keypair.fromSeed(seed32)

        return {
            publicKey: keypair.publicKey.toBase58(),
            privateKey: base58.encode(keypair.secretKey),
            accountAddress: keypair.publicKey.toBase58(),
            platform: Platform.Solana,
        }
    }

    fromPrivateKey(privateKey: string): Wallet {
        const keypair = Keypair.fromSecretKey(base58.decode(privateKey))
        return {
            publicKey: keypair.publicKey.toBase58(),
            privateKey,
            accountAddress: keypair.publicKey.toBase58(),
            platform: Platform.Solana,
        }
    }

    private deriveAccountSeed(seed: Uint8Array, accountNumber: number): Uint8Array {
        const numBuf = new Uint8Array([accountNumber])
        const concat = new Uint8Array(seed.length + numBuf.length)
        concat.set(seed)
        concat.set(numBuf, seed.length)
        return sha512(concat)
    }
}