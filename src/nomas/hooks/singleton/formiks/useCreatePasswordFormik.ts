import { useFormik } from "formik"
import * as Yup from "yup"
import { useContext } from "react"
import { FormikContext } from "./FormikProvider"
import { Mnemonic, WalletGenerator } from "@ciwallet-sdk/classes"
import { ChainId } from "@ciwallet-sdk/types"
import { StorageCollection, useStorage } from "@ciwallet-sdk/providers"
import { useAppSelector } from "@/nomas/redux"

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
    const { adapter } = useStorage()
    const encryption = useAppSelector((state) => state.crypto.encryption)
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
            const walletGenerator = new WalletGenerator()
            // generate wallets
            const wallets = await walletGenerator.generateWallets({
                mnemonic,
                chainIds: [ChainId.Monad, ChainId.Sui, ChainId.Solana],
                password: values.password,
            })
            console.log("wallets", wallets)
            // encrypt mnemonic
            const encryptedMnemonic = await encryption.encrypt(mnemonic, values.password)
            // save mnemonic to storage
            await adapter.create(
                StorageCollection.Mnemonic,
                {
                    encryptedMnemonic,
                }
            )
            // save wallets to storage
            await adapter.createMany(
                StorageCollection.Wallet,
                wallets
            )
        },
    })
}
