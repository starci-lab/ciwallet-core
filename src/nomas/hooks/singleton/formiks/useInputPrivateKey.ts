import { useFormik } from "formik"
import * as Yup from "yup"
import { useContext } from "react"
import { FormikContext } from "./FormikProvider"    
import { Platform } from "@ciwallet-sdk/types"
import { isValidPrivateKey } from "@ciwallet-sdk/utils"
import { MyWalletsPage, addImportedWallet, resolveAccountsThunk, setMyWalletsPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { v4 } from "uuid"
import { encryptionObj } from "@/nomas/obj"

// -------------------------------------
// Formik Values Interface
// -------------------------------------
export interface InputPrivateKeyFormikValues {
    privateKey: string
    platform: Platform
}

// -------------------------------------
// Yup Validation Schema
// -------------------------------------
const validationSchema = Yup.object({
    privateKey: Yup.string()
        .required("Private key is required")
        .test("is-valid-private-key", function (value) {
            if (!value) return this.createError({ message: "Recipient address is required" })
            let valid = false
            switch (this.parent.platform) {
            case Platform.Evm:
                valid = isValidPrivateKey(value, Platform.Evm)
                break
            case Platform.Solana:
                valid = isValidPrivateKey(value, Platform.Solana)
                break
            case Platform.Sui:
                valid = isValidPrivateKey(value, Platform.Sui)
                break
            case Platform.Aptos:
                valid = isValidPrivateKey(value, Platform.Aptos)
                break
            }
            if (!valid) {
                return this.createError({ message: "Invalid private key for this platform" })
            }
            return true
        }),
})

// -------------------------------------
// Hook to access Formik from Context
// -------------------------------------
export const useInputPrivateKeyFormik = () => {
    const context = useContext(FormikContext)
    if (!context) {
        throw new Error("useInputPrivateKeyFormik must be used within a FormikProvider")
    }
    return context.inputPrivateKeyFormik
}

// -------------------------------------
// Main Core Hook
// -------------------------------------
export const useInputPrivateKeyFormikCore = () => {
    const dispatch = useAppDispatch()
    const importedWallets = useAppSelector((state) => state.persists.session.importedWallets)
    const password = useAppSelector((state) => state.persists.session.password)
    const formik = useFormik<InputPrivateKeyFormikValues>({
        initialValues: {
            privateKey: "",
            platform: Platform.Evm,
        },
        validationSchema,
        onSubmit: async (values) => {
            // generate a name for the imported wallet
            dispatch(addImportedWallet({
                id: v4(),
                platform: values.platform,
                encryptedPrivateKey: await encryptionObj.encrypt(values.privateKey, password),
                name: `Imported Wallet ${importedWallets.length + 1}`,
            }))
            // 6. Set thunk to resolve accounts
            const accountsResultAction = await dispatch(resolveAccountsThunk())
            // 7. Redirect to accounts scene
            if (accountsResultAction.meta.requestStatus === "fulfilled") {
                dispatch(setMyWalletsPage(MyWalletsPage.Accounts))
            }
            // 8. Redirect to accounts scene
            dispatch(setMyWalletsPage(MyWalletsPage.Management))
        },
    })
    return formik
}