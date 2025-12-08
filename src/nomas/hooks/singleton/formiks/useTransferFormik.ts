import { useFormik } from "formik"
import * as Yup from "yup"
import { useContext, useEffect } from "react"
import { FormikContext } from "./FormikProvider"
import { WithdrawFunctionPage, selectSelectedAccounts, selectTokens, setWithdrawFunctionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { Platform, TokenId, type ChainIdWithAllNetwork } from "@ciwallet-sdk/types"
import { useTransfer } from "@ciwallet-sdk/hooks"
import { isValidAddress } from "@ciwallet-sdk/utils"
import { chainManagerObj, tokenManagerObj } from "@/nomas/obj"
import Decimal from "decimal.js"

// -------------------------------------
// Formik Values Interface
// -------------------------------------
export interface TransferFormikValues {
  chainId: ChainIdWithAllNetwork
  toAddress: string
  amount: number
  txHash: string
  platform?: Platform
  gasTokenId: TokenId | undefined
  isEnoughGasBalance: boolean
  tokenId: TokenId | undefined
  balance: number
  amountFocused: boolean
  searchTokenQuery: string
}

// -------------------------------------
// Yup Validation Schema
// -------------------------------------
const validationSchema = Yup.object({
    chainId: Yup.string()
        .required("Chain is required"),
    toAddress: Yup.string()
        .required("Recipient address is required")
        .test("is-valid-address", function (value) {
            const { platform } = this.parent
            const messages = {
                evm: "Invalid EVM address",
                solana: "Invalid Solana address",
                sui: "Invalid Sui address",
                aptos: "Invalid Aptos address",
            }
            if (!value) return this.createError({ message: "Recipient address is required" })
            let valid = false
            switch (platform) {
            case Platform.Evm:
                valid = isValidAddress(value, Platform.Evm)
                break
            case Platform.Solana:
                valid = isValidAddress(value, Platform.Solana)
                break
            case Platform.Sui:
                valid = isValidAddress(value, Platform.Sui)
                break
            case Platform.Aptos:
                valid = isValidAddress(value, Platform.Aptos)
                break
            }
            if (!valid) {
                return this.createError({ message: messages[platform as keyof typeof messages] || "Invalid recipient address" })
            }
            return true
        }),
    isEnoughGasBalance: Yup.boolean()
        .required("Is enough gas balance is required")
        .oneOf([true], "You need to have at least 0.01 {gasTokenSymbol} to cover the gas fee."),
    amount: Yup.number()
        .required("Amount is required")
        .positive("Amount must be greater than 0")
        .max(1_000_000, "Amount too large")
        .test("max-balance", "Amount exceeds available balance", function (value) {
            const { balance } = this.parent
            return !balance || !value || value <= balance
        }),
    amountFocused: Yup.boolean()
        .required("Amount focused is required"),
})

// -------------------------------------
// Hook to access Formik from Context
// -------------------------------------
export const useTransferFormik = () => {
    const context = useContext(FormikContext)
    if (!context) {
        throw new Error("useTransferFormik must be used within a FormikProvider")
    }
    return context.transferFormik
}

// -------------------------------------
// Main Core Hook
// -------------------------------------
export const useTransferFormikCore = () => {
    const network = useAppSelector((state) => state.persists.session.network)
    const rpcs = useAppSelector((state) => state.persists.session.rpcs)
    const tokenArray = useAppSelector((state) => selectTokens(state.persists))
    const { handle } = useTransfer()
    const selectedAccounts = useAppSelector((state) => selectSelectedAccounts(state.persists))
    const dispatch = useAppDispatch()
    const formik = useFormik<TransferFormikValues>({
        initialValues: {
            isEnoughGasBalance: false,
            gasTokenId: undefined,
            chainId: "all-network",
            toAddress: "",
            amount: 0,
            tokenId: undefined,
            balance: 0,
            amountFocused: false,
            searchTokenQuery: "",
            txHash: "",
            platform: undefined,
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const selectedAccount = selectedAccounts[values.platform ?? Platform.Evm]
                const token = tokenArray.find((token) => token.tokenId === values.tokenId)
                if (!token) return
                const result = await handle({
                    chainId: token.chainId,
                    network,
                    decimals: tokenArray.find((token) => token.tokenId === values.tokenId)?.decimals ?? 18,
                    toAddress: values.toAddress,
                    amount: values.amount,
                    tokenAddress: tokenArray.find((token) => token.tokenId === values.tokenId)?.address ?? "",
                    rpcs: rpcs[token.chainId][network],
                    privateKey: selectedAccount?.privateKey ?? "",
                })
                formik.setFieldValue("txHash", result.txHash)
                dispatch(setWithdrawFunctionPage(WithdrawFunctionPage.TransactionReceipt))
            } catch (error) {
                console.error(error)
            }
        },
    })
    const balances = useAppSelector((state) => state.stateless.dynamic.balances)
    useEffect(() => {
        if (!formik.values.gasTokenId) return
        const gasToken = tokenManagerObj.getTokenById(formik.values.gasTokenId)
        if (!gasToken) return
        const chainMetadata = chainManagerObj.getChainById(gasToken.chainId)
        formik.setFieldValue("isEnoughGasBalance",
            new Decimal(balances[gasToken.tokenId] ?? 0)
                .gte(chainMetadata?.minimumGasRequired ?? 0)
        )
    }, [balances, formik.values.gasTokenId])
    return formik
}