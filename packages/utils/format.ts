import { ethers } from "ethers"
import { Platform } from "@ciwallet-sdk/types"
import { isValidSuiAddress } from "@mysten/sui/utils"
import { PublicKey } from "@solana/web3.js"
import { roundNumber } from "./math"
import bs58 from "bs58"

export const sanitizeNumericInput = (input: string): string | null => {
    const regex = new RegExp(/^\d*[.,]?\d*$/)
    if (!regex.test(input)) {
        return null
    }
    const sanitizedValue = input.replace(/,/g, ".")
    return sanitizedValue
}

export const shortenAddress = (address: string, chars = 4): string => {
    if (!address) return ""
    return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export const formatBigInt = (
    fee: bigint | undefined,
    decimals = 18,
    fragDigits = 5,
): string => {
    if (!fee) return "0"

    const formatted = ethers.formatUnits(fee, decimals)
    const round = roundNumber(Number(formatted), fragDigits)

    return `${round}`
}

export const isValidSolanaAddress = (address: string): boolean => {
    try {
        new PublicKey(address)
        return true
    } catch {
        return false
    }
}

export const isValidAddress = (
    address: string,
    platform: Platform,
): boolean => {
    switch (platform) {
    case Platform.Evm:
        return ethers.isAddress(address)
    case Platform.Solana:
        return isValidSolanaAddress(address)
    case Platform.Sui:
        return isValidSuiAddress(address)
    case Platform.Aptos:
        return true
    default:
        throw new Error(`Invalid platform: ${platform}`)
    }
}

export const isValidPrivateKey = (privateKey: string, platform: Platform): boolean => {
    try {
        switch (platform) {
        case Platform.Evm:
            return isValidEvmPrivateKey(privateKey)
        case Platform.Solana:
            return isValidSolanaPrivateKey(privateKey)
        case Platform.Sui:
            return isValidSuiPrivateKey(privateKey)
        case Platform.Aptos:
            return isValidAptosPrivateKey(privateKey)
        default:
            return false
        }
    } catch {
        return false
    }
}

// -------------------------------------
// EVM — 64-hex (secp256k1)
// -------------------------------------
const isValidEvmPrivateKey = (key: string): boolean => {
    try {
        const cleaned = key.startsWith("0x") ? key : `0x${key}`
        return ethers.isHexString(cleaned, 32)
    } catch {
        return false
    }
}


// -------------------------------------
// Solana — base58 or JSON array of 64 bytes
// -------------------------------------
const isValidSolanaPrivateKey = (key: string): boolean => {
    try {
        // base58 encoded key
        if (/^[1-9A-HJ-NP-Za-km-z]+$/.test(key)) {
            const decoded = bs58.decode(key)
            return decoded.length === 64
        }
  
        // JSON array of numbers (Uint8Array)
        if (key.startsWith("[") && key.endsWith("]")) {
            const arr = JSON.parse(key)
            return Array.isArray(arr) && arr.length === 64 && arr.every((n) => Number.isInteger(n))
        }
  
        return false
    } catch {
        return false
    }
}

// -------------------------------------
// Sui — 0x-prefixed, Ed25519 / Secp256r1
// usually 64-byte or 66-byte hex string
// -------------------------------------
const isValidSuiPrivateKey = (key: string): boolean => {
    try {
        const cleaned = key.startsWith("0x") ? key.slice(2) : key
        // Ed25519 and Secp256r1 keys are both 32 or 64 bytes hex
        return /^[0-9a-fA-F]+$/.test(cleaned) && (cleaned.length === 64 || cleaned.length === 128)
    } catch {
        return false
    }
}

// -------------------------------------
// Aptos — 32-byte Ed25519 hex string
// or mnemonic-derived 0x-prefixed
// -------------------------------------
const isValidAptosPrivateKey = (key: string): boolean => {
    try {
        const cleaned = key.startsWith("0x") ? key.slice(2) : key
        return /^[0-9a-fA-F]+$/.test(cleaned) && cleaned.length === 64
    } catch {
        return false
    }
}