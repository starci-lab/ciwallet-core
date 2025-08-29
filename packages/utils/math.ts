import BN from "bn.js"  
import { Decimal } from "decimal.js"

export const toRaw = (amount: number, decimals: number = 18): BN => {
    return new BN(
        new Decimal(amount).mul(new Decimal(10).pow(decimals)).toString(),
    )
}

export const toDenomination = (amount: BN, decimals: number = 18): number => {
    const value = new BN(amount)
        .mul(new BN(10).pow(new BN(5)))
        .div(new BN(10).pow(new BN(decimals)))
        .toString()
    return new Decimal(value)
        .div(new Decimal(10).pow(new Decimal(5)))
        .toNumber()
}