import type { IWallet, Wallet } from "./IWallet"
import { ethers} from "ethers"
export class EvmWallet implements IWallet {
    constructor() {}

    fromMnemonic(mnemonic: string, accountNumber = 0): Wallet {
        const account = ethers.HDNodeWallet.fromPhrase(
            mnemonic, "", `m/44'/60'/0'/0/${accountNumber}`  
        )
        return {
            accountAddress: account.address,
            privateKey: account.privateKey,
            publicKey: account.publicKey,
        }
    }
}