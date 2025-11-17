import { useFormik } from "formik"
import * as Yup from "yup"
import { useContext } from "react"
import { FormikContext } from "./FormikProvider"
import { encryptionObj, mnemonicObj } from "@/nomas/obj"
import { v4 } from "uuid"
import { addHdWallet, resolveAccountsThunk, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { MyWalletsPage, setMyWalletsPage } from "@/nomas/redux"

// -------------------------------------
// Formik Values Interface
// -------------------------------------
export interface InputMnemonicFormikValues {
    mnemonic: string
    use24Words: boolean
}

// -------------------------------------
// Yup Validation Schema
// -------------------------------------
const validationSchema = Yup.object({
    mnemonic: Yup.string()
        .required("Mnemonic is required")
        .test("is-valid-mnemonic", function (value) {
            if (!value) return this.createError({ message: "Mnemonic is required" })
            if (!mnemonicObj.validateMnemonic(value)) {
                return this.createError({ message: "Invalid mnemonic" })
            }
            return true
        }),
    use24Words: Yup.boolean()
        .required("Use 24 words is required"),
})

// -------------------------------------
// Hook to access Formik from Context
// -------------------------------------
export const useInputMnemonicFormik = () => {
    const context = useContext(FormikContext)
    if (!context) {
        throw new Error("useInputMnemonicFormik must be used within a FormikProvider")
    }
    return context.inputMnemonicFormik
}

// -------------------------------------
// Main Core Hook
// -------------------------------------
export const useInputMnemonicFormikCore = () => {
    const dispatch = useAppDispatch()
    const password = useAppSelector((state) => state.persists.session.password)
    const hdWallets = useAppSelector((state) => state.persists.session.hdWallets)
    const formik = useFormik<InputMnemonicFormikValues>({
        initialValues: {
            mnemonic: "",
            use24Words: false,
        },
        validationSchema,
        onSubmit: async (values) => {
            const encryptedMnemonic = await encryptionObj.encrypt(values.mnemonic, password)
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

    return formik
}