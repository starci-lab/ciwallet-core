import { useFormik } from "formik"
import * as Yup from "yup"
import { useContext } from "react"
import { FormikContext } from "./FormikProvider"
import { Mnemonic } from "@ciwallet-sdk/classes"
import {
    InitPage,
    setEncryptedMnemonic,
    setInitPage,
    useAppDispatch,
    setPassword,
    resolveAccountsThunk,
    addHdWallet,
    setScene,
    Scene,
} from "@/nomas/redux"
import { encryptionObj } from "@/nomas/obj"
import zxcvbn from "zxcvbn"
import { PasswordStrength } from "./types"
import { v4 } from "uuid"

// -------------------------------------
// Formik Values Interface
// -------------------------------------
export interface CreatePasswordFormikValues {
    password: string
    confirmPassword: string
    passwordStrength: PasswordStrength
}

// -------------------------------------
// Yup Validation Schema
// -------------------------------------
const validationSchema = Yup.object({
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .max(64, "Password must not exceed 64 characters")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Password does not match")
        .required("Confirm Password is required"),
})

// -------------------------------------
// Convert zxcvbn Score → PasswordStrength Enum
// -------------------------------------
const getPasswordStrength = (password: string): PasswordStrength => {
    const result = zxcvbn(password)
    switch (result.score) {
    case 0:
    case 1:
        return PasswordStrength.Weak
    case 2:
        return PasswordStrength.Medium
    case 3:
        return PasswordStrength.Strong
    case 4:
        return PasswordStrength.VeryStrong
    default:
        return PasswordStrength.Weak
    }
}

// -------------------------------------
// Hook to access Formik from Context
// -------------------------------------
export const useCreatePasswordFormik = () => {
    const context = useContext(FormikContext)
    if (!context) {
        throw new Error("useCreatePasswordFormik must be used within a FormikProvider")
    }
    return context.createPasswordFormik
}

// -------------------------------------
// Main Core Hook
// -------------------------------------
export const useCreatePasswordFormikCore = () => {
    const dispatch = useAppDispatch()

    const formik = useFormik<CreatePasswordFormikValues>({
        initialValues: {
            password: "",
            confirmPassword: "",
            passwordStrength: PasswordStrength.Weak,
        },
        validationSchema,
        onSubmit: async (values) => {
            // 1. Generate mnemonic
            const mnemonic = new Mnemonic().generate(true)
            // 2. Encrypt mnemonic
            const encryptedMnemonic = await encryptionObj.encrypt(mnemonic, values.password)
            // 3. Save encrypted mnemonic
            dispatch(setEncryptedMnemonic(encryptedMnemonic))
            // 4. Save password + init state
            dispatch(setPassword(values.password))
            dispatch(setInitPage(InitPage.Splash))
            // 5. Add hd wallet
            dispatch(addHdWallet({
                id: v4(),
                encryptedMnemonic,
                isDefault: true,
                accounts: [
                    {
                        id: v4(),
                        name: "Account 1",
                        index: 0,
                    },
                ],
                name: "Wallet 1",
            }))
            // 6. Set thunk to resolve accounts
            const resultAction = await dispatch(resolveAccountsThunk())
            // 7. Redirect to main scene
            if (resultAction.meta.requestStatus === "fulfilled") {
                dispatch(setScene(Scene.Main))
            }
        },
        validate: (values) => {
            const errors: Partial<Record<keyof CreatePasswordFormikValues, string>> = {}
            // Dynamically update password strength using zxcvbn
            const strength = getPasswordStrength(values.password)
            if (values.passwordStrength !== strength) {
                formik.setFieldValue("passwordStrength", strength, false)
                errors.passwordStrength = strength
            }
            return errors
        },
    })

    return formik
}