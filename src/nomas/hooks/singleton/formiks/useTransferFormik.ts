import { useFormik } from "formik"
import * as Yup from "yup"
import { useContext, useEffect, useMemo } from "react"
import { FormikContext } from "./FormikProvider"
import { WithdrawFunctionPage, selectSelectedAccountByPlatform, selectTokens, setWithdrawFunctionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { ChainId, Platform, TokenId, TokenType } from "@ciwallet-sdk/types"
import { useTransfer } from "@ciwallet-sdk/hooks"
import { chainIdToPlatform, isValidAddress } from "@ciwallet-sdk/utils"

// -------------------------------------
// Formik Values Interface
// -------------------------------------
export interface TransferFormikValues {
  chainId: ChainId
  toAddress: string
  amount: number
  txHash: string
  gasTokenId: TokenId
  isEnoughGasBalance: boolean
  tokenId: TokenId
  balance: number
  privateKey: string
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
            const { chainId } = this.parent
            const platform = chainIdToPlatform(chainId)
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
                return this.createError({ message: messages[platform] || "Invalid recipient address" })
            }
            return true
        }),
    isEnoughGasBalance: Yup.boolean()
        .required("Is enough gas balance is required")
        .oneOf([true], "You need to have at least 0.1 MON to cover the gas fee"),
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
    const dispatch = useAppDispatch()
    const formik = useFormik<TransferFormikValues>({
        initialValues: {
            isEnoughGasBalance: false,
            gasTokenId: TokenId.MonadTestnetMon,
            chainId: ChainId.Monad,
            toAddress: "",
            amount: 0,
            tokenId: TokenId.MonadTestnetMon,
            balance: 0,
            privateKey: "",
            amountFocused: false,
            searchTokenQuery: "",
            txHash: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const result = await handle({
                    chainId: formik.values.chainId,
                    network,
                    decimals: tokenArray.find((token) => token.tokenId === values.tokenId)?.decimals ?? 18,
                    toAddress: values.toAddress,
                    amount: values.amount,
                    tokenAddress: tokenArray.find((token) => token.tokenId === values.tokenId)?.address ?? "",
                    rpcs: rpcs[formik.values.chainId][network],
                    privateKey: values.privateKey,
                })
                console.log("Transfer result:", result)
                formik.setFieldValue("txHash", result.txHash)
                dispatch(setWithdrawFunctionPage(WithdrawFunctionPage.TransactionReceipt))
            } catch (error) {
                console.error(error)
            }
        },
    })
    // we need to set the private key from the selected account
    const selectedAccount = useAppSelector((state) => 
        selectSelectedAccountByPlatform(
            state.persists, 
            chainIdToPlatform(formik.values.chainId))
    )
    useEffect(() => {
        if (!selectedAccount) return
        formik.setFieldValue("privateKey", selectedAccount.privateKey)
    }, [selectedAccount])
    const balances = useAppSelector((state) => state.stateless.dynamic.balances)
    const gasTokenId = useMemo(() => {
        return tokenArray.find((token) => token.chainId === formik.values.chainId && token.network === network && token.type === TokenType.Native)?.tokenId
    }, [tokenArray, formik.values.chainId, network])
    
    useEffect(() => {
        if (!gasTokenId) return
        formik.setFieldValue("isEnoughGasBalance", (balances[gasTokenId] ?? 0) >= 0.1)
    }, [gasTokenId, balances])
    return formik
}