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