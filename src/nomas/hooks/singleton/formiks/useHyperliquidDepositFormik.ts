import { useFormik } from "formik"
import * as Yup from "yup"
import { useContext, useEffect } from "react"
import { FormikContext } from "./FormikProvider"
import {
    Scene,
    resolveAccountsThunk,
    resolveTokensThunk,
    setPassword,
    setScene,
    useAppDispatch,
    useAppSelector,
} from "@/nomas/redux"
import { encryptionObj } from "@/nomas/obj"
import zxcvbn from "zxcvbn"
import { PasswordStrength } from "./types"
import { HyperliquidDepositAsset } from "@ciwallet-sdk/classes"
import { ChainId } from "@ciwallet-sdk/types"

// -------------------------------------
// Formik Values Interface
// -------------------------------------
export interface HyperliquidDepositFormikValues {
    asset: HyperliquidDepositAsset
    chainId: ChainId
    amount: number
    amountFocused: boolean
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
    const dispatch = useAppDispatch()
    const encryptedMnemonic = useAppSelector(
        (state) => state.persists.session.encryptedMnemonic
    )

    const formik = useFormik<HyperliquidDepositFormikValues>({
        initialValues: {
            asset: HyperliquidDepositAsset.Usdc,
            chainId: ChainId.Arbitrum,
            amount: 0,
            amountFocused: false,
        },
        validationSchema,
        onSubmit: async (values, { setFieldError }) => {
            console.log("Hyperliquid deposit formik onSubmit")
        },
    })

    // -------------------------------------
    return formik
}