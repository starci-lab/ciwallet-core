import { useFormik } from "formik"
import * as Yup from "yup"
import { useContext, useEffect } from "react"
import { FormikContext } from "./FormikProvider"
import {
    Scene,
    setPassword,
    setScene,
    useAppDispatch,
    useAppSelector,
} from "@/nomas/redux"
import { encryptionObj } from "@/nomas/obj"
import zxcvbn from "zxcvbn"
import { PasswordStrength } from "./types"

// -------------------------------------
// Formik Values Interface
// -------------------------------------
export interface InputPasswordFormikValues {
  password: string
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
})

// -------------------------------------
// Convert zxcvbn score → PasswordStrength Enum
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
export const useInputPasswordFormik = () => {
    const context = useContext(FormikContext)
    if (!context) {
        throw new Error("useInputPasswordFormik must be used within a FormikProvider")
    }
    return context.inputPasswordFormik
}

// -------------------------------------
// Main Core Hook
// -------------------------------------
export const useInputPasswordFormikCore = () => {
    const dispatch = useAppDispatch()
    const encryptedMnemonic = useAppSelector(
        (state) => state.persists.session.encryptedMnemonic
    )

    const formik = useFormik<InputPasswordFormikValues>({
        initialValues: {
            password: "",
            passwordStrength: PasswordStrength.Weak,
        },
        validationSchema,
        onSubmit: async (values, { setFieldError }) => {
            try {
                if (!encryptedMnemonic) {
                    setFieldError("password", "No encrypted mnemonic found")
                    return
                }

                // Try decrypt mnemonic with password
                await encryptionObj.decrypt(encryptedMnemonic, values.password)

                // Save password + redirect scene
                dispatch(setPassword(values.password))
                dispatch(setScene(Scene.Main))
            } catch {
                setFieldError("password", "Invalid password")
            }
        },
    })

    // -------------------------------------
    // Recalculate password strength on change
    // -------------------------------------
    useEffect(() => {
        const { password } = formik.values
        const strength = getPasswordStrength(password)
        if (formik.values.passwordStrength !== strength) {
            formik.setFieldValue("passwordStrength", strength, false)
        }
    }, [formik.values.password])

    return formik
}