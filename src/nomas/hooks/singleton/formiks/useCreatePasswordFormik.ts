import { useFormik } from "formik"
import * as Yup from "yup"
import { useContext } from "react"
import { FormikContext } from "./FormikProvider"
import { Mnemonic } from "@ciwallet-sdk/classes"
import { ChainId } from "@ciwallet-sdk/types"
import { InitPage, addAccount, setEncryptedMnemonic, setInitPage, useAppDispatch } from "@/nomas/redux"
import { encryptionObj, walletGeneratorObj } from "@/nomas/obj"
import { v4 as uuidv4 } from "uuid"

export interface CreatePasswordFormikValues {
    password: string;
    confirmPassword: string;
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
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
})

export const useCreatePasswordFormik = () => {
    const context = useContext(FormikContext)
    if (!context) {
        throw new Error(
            "useCreatePasswordFormik must be used within a FormikProvider"
        )
    }
    return context.createPasswordFormik
}

export const useCreatePasswordFormikCore = () => {
    const dispatch = useAppDispatch()
    return useFormik<CreatePasswordFormikValues>({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            // generate mnemonic
            const mnemonic = new Mnemonic().generate(true)
            // generate wallets
            // generate wallets
            const wallets = await walletGeneratorObj.generateWallets({
                mnemonic,
                chainIds: [ChainId.Monad, ChainId.Sui, ChainId.Solana],
                password: values.password,
            })
            // encrypt mnemonic
            const encryptedMnemonic = await encryptionObj.encrypt(mnemonic, values.password)
            // save mnemonic to storage
            dispatch(setEncryptedMnemonic(encryptedMnemonic))
            Object.entries(wallets).forEach(([chainId, wallet]) => {
                dispatch(
                    addAccount(
                        { 
                            chainId: chainId as ChainId, 
                            account: {
                                id: uuidv4(),
                                accountAddress: wallet.accountAddress,
                                chainId: chainId as ChainId,
                                encryptedPrivateKey: wallet.privateKey,
                                name: "Account 1",
                                publicKey: wallet.publicKey,
                                avatarUrl: "",
                            } }))
                dispatch(setInitPage(InitPage.Splash))
            })
        },
    })
}
