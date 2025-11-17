import { generateMnemonic, mnemonicToSeedSync, validateMnemonic, wordlists } from "bip39"
export class Mnemonic {
    constructor() {}

    generate(use24Words = false) {
        return generateMnemonic(use24Words ? 256 : undefined)
    }

    toSeed(mnemonic: string) {
        return mnemonicToSeedSync(mnemonic)
    }

    validateWord(word: string) {
        return wordlists.english.includes(word.toLowerCase())
    }

    validateMnemonic(mnemonic: string) {
        return validateMnemonic(mnemonic)
    }
}