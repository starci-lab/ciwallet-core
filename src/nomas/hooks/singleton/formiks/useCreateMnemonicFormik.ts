import { useFormik } from "formik"
import * as Yup from "yup"
import { useContext, useMemo } from "react"
import { FormikContext } from "./FormikProvider"
import { encryptionObj, mnemonicObj } from "@/nomas/obj"
import { MyWalletsPage, addHdWallet, resolveAccountsThunk, setMyWalletsPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { v4 } from "uuid"

// -------------------------------------
// Formik Values Interface
// -------------------------------------
export interface CreateMnemonicFormikValues {
    mnemonic12: string
    mnemonic24: string
    use24Words: boolean
}

// -------------------------------------
// Yup Validation Schema
// -------------------------------------
const validationSchema = Yup.object({
    mnemonic12: Yup.string()
        .required("Mnemonic 12 words is required")
        .test("is-valid-mnemonic", function (value) {
            if (!value) return this.createError({ message: "Mnemonic 12 words is required" })
            if (!mnemonicObj.validateMnemonic(value)) {
                return this.createError({ message: "Invalid mnemonic 12 words" })
            }
            return true
        }),
    mnemonic24: Yup.string()
        .required("Mnemonic 24 words is required")
        .test("is-valid-mnemonic", function (value) {
            if (!value) return this.createError({ message: "Mnemonic 24 words is required" })
            if (!mnemonicObj.validateMnemonic(value)) {
                return this.createError({ message: "Invalid mnemonic 24 words" })
            }
            return true
        }),
    use24Words: Yup.boolean()
        .required("Use 24 words is required"),
})

// -------------------------------------
// Hook to access Formik from Context
// -------------------------------------
export const useCreateMnemonicFormik = () => {
    const context = useContext(FormikContext)
    if (!context) {
        throw new Error("useCreateMnemonicFormik must be used within a FormikProvider")
    }
    return context.createMnemonicFormik
}

// -------------------------------------
// Main Core Hook
// -------------------------------------
export const useCreateMnemonicFormikCore = () => {
    const dispatch = useAppDispatch()
    const password = useAppSelector((state) => state.persists.session.password)
    const hdWallets = useAppSelector((state) => state.persists.session.hdWallets)
    const formik = useFormik<CreateMnemonicFormikValues>({
        initialValues: {
            mnemonic12: "",
            mnemonic24: "",
            use24Words: false,
        },
        validationSchema,
        onSubmit: async (values) => {
            const encryptedMnemonic = await encryptionObj.encrypt(values.use24Words ? values.mnemonic24 : values.mnemonic12, password)
            dispatch(addHdWallet({
                id: v4(),
                encryptedMnemonic,
                isDefault: false,
                accounts: [
                    {
                        id: v4(),
                        name: `Account ${hdWallets.length + 1}`,
                        index: hdWallets.length,
                    },
                ],
                name: `Wallet ${hdWallets.length + 1}`,
            }))
            // 6. Set thunk to resolve accounts
            const accountsResultAction = await dispatch(resolveAccountsThunk())
            // 7. Redirect to accounts scene
            if (accountsResultAction.meta.requestStatus === "fulfilled") {
                dispatch(setMyWalletsPage(MyWalletsPage.Accounts))
            }
        },
    })

    return useMemo(() => formik, [formik])
}