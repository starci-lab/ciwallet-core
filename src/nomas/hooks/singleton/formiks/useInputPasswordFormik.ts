import { useFormik } from "formik"
import * as Yup from "yup"
import { useContext } from "react"
import { FormikContext } from "./FormikProvider"
import { 
    Scene,
    setPassword,
    setScene,
    useAppDispatch, useAppSelector
} from "@/nomas/redux"
import { encryptionObj } from "@/nomas/obj"

export interface InputPasswordFormikValues {
    password: string;
}

const validationSchema = Yup.object({
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .max(64, "Password must not exceed 64 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(/[@$!%*?&]/, "Password must contain at least one special character (@$!%*?&)")
        .required("Password is required"),
})

export const useInputPasswordFormik = () => {
    const context = useContext(FormikContext)
    if (!context) {
        throw new Error(
            "useInputPasswordFormik must be used within a FormikProvider"
        )
    }
    return context.inputPasswordFormik
}

export const useInputPasswordFormikCore = () => {
    const dispatch = useAppDispatch()
    const encryptedMnemonic = useAppSelector((state) => state.persits.session.encryptedMnemonic)
    return useFormik<InputPasswordFormikValues>({
        initialValues: {
            password: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setFieldError }) => {
            try {
                await encryptionObj.decrypt(encryptedMnemonic, values.password)
                dispatch(setPassword(values.password))
                dispatch(setScene(Scene.Main))
            } catch {
                setFieldError("password", "Invalid password")
            }
        },
    })
}
