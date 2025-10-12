import { ethers } from "ethers"
import { Platform } from "@ciwallet-sdk/types"
import { isValidSuiAddress } from "@mysten/sui/utils"
import { PublicKey } from "@solana/web3.js"

export const sanitizeNumericInput = (input: string): string | null => {
    const regex = new RegExp(/^\d*[.,]?\d*$/)
    if (!regex.test(input)) {
        return null
    }
    const sanitizedValue = input.replace(/,/g, ".")
    return sanitizedValue
}

export const roundNumber = (number: number, fragDigits = 5): number => {
    return Number(number.toFixed(fragDigits))
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