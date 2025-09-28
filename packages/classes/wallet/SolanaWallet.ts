import { Keypair } from "@solana/web3.js"
import type { IWallet, Wallet } from "./IWallet"
import { Mnemonic } from "./Mnemonic"
import base58 from "bs58"
import { derivePath } from "ed25519-hd-key"

export class SolanaWallet implements IWallet {
    private mnemonic: Mnemonic
    constructor() {
        this.mnemonic = new Mnemonic()
    }

    fromMnemonic(mnemonic: string, accountNumber = 0): Wallet {
        const seed = this.mnemonic.toSeed(mnemonic)
        const path = `m/44'/501'/0'/0'/${accountNumber}'`
        const { key: derivedKey } = derivePath(path, seed.toString("hex"))
        const keypair = Keypair.fromSeed(derivedKey)
        return {
            publicKey: keypair.publicKey.toBase58(),
            privateKey: base58.encode(keypair.secretKey),
            accountAddress: keypair.publicKey.toBase58()
        }
    }
}