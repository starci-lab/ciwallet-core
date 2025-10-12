import { useFormik } from "formik"
import * as Yup from "yup"
import { useContext } from "react"
import { FormikContext } from "./FormikProvider"
import { Mnemonic } from "@ciwallet-sdk/classes"
import { ChainId } from "@ciwallet-sdk/types"
import {
    InitPage,
    addAccount,
    setEncryptedMnemonic,
    setInitPage,
    useAppDispatch,
    setPassword,
} from "@/nomas/redux"
import { encryptionObj, walletGeneratorObj } from "@/nomas/obj"
import { v4 as uuidv4 } from "uuid"
import zxcvbn from "zxcvbn"
import { PasswordStrength } from "./types"

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

            // 2. Generate wallets
            const wallets = await walletGeneratorObj.generateWallets({
                mnemonic,
                chainIds: [ChainId.Monad, ChainId.Sui, ChainId.Solana],
                password: values.password,
            })

            // 3. Encrypt mnemonic
            const encryptedMnemonic = await encryptionObj.encrypt(mnemonic, values.password)

            // 4. Save encrypted mnemonic
            dispatch(setEncryptedMnemonic(encryptedMnemonic))

            // 5. Save all generated accounts
            Object.entries(wallets).forEach(([chainId, wallet]) => {
                dispatch(
                    addAccount({
                        chainId: chainId as ChainId,
                        account: {
                            id: uuidv4(),
                            accountAddress: wallet.accountAddress,
                            chainId: chainId as ChainId,
                            encryptedPrivateKey: wallet.privateKey,
                            name: "Account 1",
                            publicKey: wallet.publicKey,
                            avatarUrl: "",
                        },
                    }),
                )
            })
            // 6. Save password + init state
            dispatch(setPassword(values.password))
            dispatch(setInitPage(InitPage.Splash))
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