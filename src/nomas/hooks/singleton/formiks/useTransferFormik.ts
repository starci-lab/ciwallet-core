import { useFormik } from "formik"
import * as Yup from "yup"
import { useContext, useEffect } from "react"
import { FormikContext } from "./FormikProvider"
import { useAppSelector } from "@/nomas/redux"
import { ChainId } from "@ciwallet-sdk/types"
import { useTransfer } from "@ciwallet-sdk/hooks"
import { encryptionObj } from "@/nomas/obj"
import { chainIdToPlatform, isValidAddress } from "@ciwallet-sdk/utils"

// -------------------------------------
// Formik Values Interface
// -------------------------------------
export interface TransferFormikValues {
  chainId: ChainId
  toAddress: string
  amount: number
  tokenAddress: string
  fromAddress: string
  balance: number
  encryptedPrivateKey: string
}

// -------------------------------------
// Yup Validation Schema
// -------------------------------------
const validationSchema = Yup.object({
    chainId: Yup.string()
        .required("Chain is required"),
    toAddress: Yup.string()
        .required("Recipient address is required")
        .test("is-valid-address", "Recipient address is not valid", function (value) {
            return isValidAddress(value, chainIdToPlatform(this.parent.chainId))
        }),
    amount: Yup.number()
        .required("Amount is required")
        .positive("Amount must be greater than 0")
        .max(1_000_000, "Amount too large")
        .test("max-balance", "Amount exceeds available balance", function (value) {
            const { balance } = this.parent
            return !balance || !value || value <= balance
        }),
    fromAddress: Yup.string()
        .required("From address is required")
        .test("is-valid-address", "From address is not valid", function (value) {
            return isValidAddress(value, chainIdToPlatform(this.parent.chainId))
        }),
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
    const chainId = useAppSelector((state) => state.persists.session.chainId)
    useEffect(() => {
        formik.setFieldValue("chainId", chainId)
    }, [chainId])
    const rpcs = useAppSelector((state) => state.persists.session.rpcs)
    const password = useAppSelector((state) => state.persists.session.password)
    const { handle } = useTransfer()
    const formik = useFormik<TransferFormikValues>({
        initialValues: {
            chainId: ChainId.Monad,
            toAddress: "",
            amount: 0,
            tokenAddress: "",
            fromAddress: "",
            balance: 0,
            encryptedPrivateKey: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const privateKey = await encryptionObj.decrypt(
                    values.encryptedPrivateKey,
                    password
                )
                const result = await handle({
                    chainId,
                    network,
                    toAddress: values.toAddress,
                    amount: values.amount,
                    tokenAddress: values.tokenAddress,
                    rpcs: rpcs[chainId][network],
                    privateKey: privateKey,
                })
                console.log("Transfer result:", result)
            } catch (error) {
                console.error(error)
            }
        },
    })

    return formik
}