import { generateMnemonic, mnemonicToSeedSync } from "bip39"

export class Mnemonic {
    constructor() {}

    generate(use24Words = false) {
        return generateMnemonic(use24Words ? 256 : undefined)
    }

    toSeed(mnemonic: string) {
        return mnemonicToSeedSync(mnemonic)
    }
}