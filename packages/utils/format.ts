import { ethers } from "ethers"

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

export function shortenAddress(address: string, chars = 4): string {
    if (!address) return ""
    return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function formatBigInt(
    fee: bigint | undefined,
    decimals = 18,
    fragDigits = 5,
): string {
    if (!fee) return "0"

    const formatted = ethers.formatUnits(fee, decimals)
    const round = roundNumber(Number(formatted), fragDigits)

    return `${round}`
}
