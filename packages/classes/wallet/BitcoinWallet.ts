import { type IWallet, type Wallet } from "./IWallet"
import { Platform } from "@ciwallet-sdk/types"
import ecc from "@bitcoinerlab/secp256k1"
import * as bip39 from "bip39"
import * as bitcoin from "bitcoinjs-lib"
import { BIP32Factory } from "bip32"
import { ECPairFactory } from "ecpair"
const ECPair = ECPairFactory(ecc)
const bip32 = BIP32Factory(ecc)
export class BitcoinWallet implements IWallet {
    constructor() {}

    fromMnemonic(mnemonic: string, accountNumber = 0): Wallet {
        const seed = bip39.mnemonicToSeedSync(mnemonic)
        const root = bip32.fromSeed(seed, bitcoin.networks.bitcoin)
        const path = `m/44'/0'/0'/0/${accountNumber}`
        const child = root.derivePath(path)
        const { address } = bitcoin.payments.p2pkh({
            pubkey: child.publicKey,
            network: bitcoin.networks.bitcoin,
        })

        return {
            accountAddress: address!,
            privateKey: child.privateKey!.toString(),
            publicKey: child.publicKey.toString(),
            platform: Platform.Bitcoin,
        }
    }

    fromPrivateKey(privateKey: string): Wallet {
        const keyPair = ECPair.fromWIF(privateKey, bitcoin.networks.bitcoin)
        const { address } = bitcoin.payments.p2pkh({
            pubkey: keyPair.publicKey,
            network: bitcoin.networks.bitcoin,
        })

        return {
            accountAddress: address!,
            privateKey,
            publicKey: keyPair.publicKey.toString(),
            platform: Platform.Bitcoin,
        }
    }
}