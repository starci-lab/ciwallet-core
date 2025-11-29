import { useFormik } from "formik"
import * as Yup from "yup"
import { useContext, useEffect } from "react"
import { FormikContext } from "./FormikProvider"
import {
    useAppSelector,
} from "@/nomas/redux"
import { HyperliquidDepositAsset } from "@ciwallet-sdk/classes"
import { ChainId, TokenId } from "@ciwallet-sdk/types"
import { chainManagerObj, tokenManagerObj } from "@/nomas/obj"
import Decimal from "decimal.js"

// -------------------------------------
// Formik Values Interface
// -------------------------------------
export interface HyperliquidDepositFormikValues {
    asset: HyperliquidDepositAsset
    chainId: ChainId
    amount: number
    amountFocused: boolean
    gasTokenId: TokenId | undefined
    isEnoughGasBalance: boolean
}

// -------------------------------------
// Yup Validation Schema
// -------------------------------------
const validationSchema = Yup.object({
    asset: Yup.string()
        .required("Asset is required"),
    chainId: Yup.string()
        .required("Chain ID is required"),
    amount: Yup.number()
        .min(5, "Amount must be greater than 5")
        .required("Amount is required"),
    amountFocused: Yup.boolean()
        .required("Amount focused is required"),
    isEnoughGasBalance: Yup.boolean()
        .required("Is enough gas balance is required")
        .oneOf([true], "You need to have at least 0.01 {gasTokenSymbol} to cover the gas fee."),
})

// -------------------------------------
// Hook to access Formik from Context
// -------------------------------------
export const useHyperliquidDepositFormik = () => {
    const context = useContext(FormikContext)
    if (!context) {
        throw new Error("useHyperliquidDepositFormik must be used within a FormikProvider")
    }
    return context.hyperliquidDepositFormik
}

// -------------------------------------
// Main Core Hook
// -------------------------------------
export const useHyperliquidDepositFormikCore = () => {
    const formik = useFormik<HyperliquidDepositFormikValues>({
        initialValues: {
            asset: HyperliquidDepositAsset.Usdc,
            chainId: ChainId.Arbitrum,
            amount: 0,
            amountFocused: false,
            gasTokenId: TokenId.ArbitrumMainnetNative,
            isEnoughGasBalance: false,
        },
        validationSchema,
        onSubmit: async (values) => {
            // TODO: Implement deposit logic
        }
    })
    const balances = useAppSelector((state) => state.stateless.dynamic.balances)
    useEffect(() => {
        const gasToken = tokenManagerObj.getTokenById(formik.values.gasTokenId)
        if (!gasToken) return
        const chainMetadata = chainManagerObj.getChainById(gasToken.chainId)
        formik.setFieldValue("isEnoughGasBalance",
            new Decimal(balances[gasToken.tokenId] ?? 0)
                .gte(chainMetadata?.minimumGasRequired ?? 0)
        )
    }, [balances, formik.values.gasTokenId])
    // -------------------------------------
    return formik
}