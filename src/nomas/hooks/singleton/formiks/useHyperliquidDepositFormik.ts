import { useFormik } from "formik"
import * as Yup from "yup"
import { useContext, useEffect } from "react"
import { FormikContext } from "./FormikProvider"
import {
    selectSelectedAccounts,
    useAppSelector,
    setDepositSuccess,
    setDepositTxHash,
    useAppDispatch,
    setPerpSectionPage,
    PerpSectionPage,
} from "@/nomas/redux"
import { HyperliquidDepositAsset } from "@ciwallet-sdk/classes"
import { ChainId, TokenId } from "@ciwallet-sdk/types"
import { chainManagerObj, hyperliquidDepositObj, hyperliquidObj, tokenManagerObj } from "@/nomas/obj"
import Decimal from "decimal.js"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"

// -------------------------------------
// Formik Values Interface
// -------------------------------------
export interface HyperliquidDepositFormikValues {
    asset: HyperliquidDepositAsset
    chainId: ChainId
    amount: number
    balanceAmount: number
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
        .min(5, "Amount must be greater than or equal to 5")
        .required("Amount is required")
        .test("amount-less-than-balance", "Amount must be less than or equal to balance", function (value) {
            const { balanceAmount } = this.parent
            return value !== undefined && new Decimal(value).lte(balanceAmount)
        }),
    balanceAmount: Yup.number(),
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
    const selectedAccounts = useAppSelector((state) => selectSelectedAccounts(state.persists))
    const network = useAppSelector((state) => state.persists.session.network)
    const rpcs = useAppSelector((state) => state.persists.session.rpcs)
    const dispatch = useAppDispatch()
    const formik = useFormik<HyperliquidDepositFormikValues>({
        initialValues: {
            asset: HyperliquidDepositAsset.Usdc,
            chainId: ChainId.Arbitrum,
            amount: 0,
            balanceAmount: 0,
            amountFocused: false,
            gasTokenId: TokenId.ArbitrumMainnetNative,
            isEnoughGasBalance: false,
        },
        validationSchema,
        onSubmit: async (values) => {
            const platform = chainIdToPlatform(values.chainId)
            const selectedAccount = selectedAccounts[platform]
            if (!selectedAccount) return
            // TODO: Implement deposit logic
            const result = await hyperliquidDepositObj.deposit({
                asset: values.asset,
                chainId: values.chainId,
                amount: values.amount,
                privateKey: selectedAccount.privateKey,
                network,
                rpcs: rpcs[values.chainId][network],
            })
            dispatch(setDepositTxHash(result.txHash))
            dispatch(setDepositSuccess(true))
            dispatch(setPerpSectionPage(PerpSectionPage.TransactionReceipt))
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
    useEffect(() => {
        const ref = hyperliquidObj.getDepositAssetInfoByAsset(formik.values.asset).refs.find((ref) => ref.chainId === formik.values.chainId)
        if (!ref) return
        const token = tokenManagerObj.getTokenById(ref.tokenId)
        if (!token) return
        formik.setFieldValue("balanceAmount", balances[token.tokenId] ?? 0)
    }, [balances, formik.values.asset, formik.values.chainId])
    return formik
}