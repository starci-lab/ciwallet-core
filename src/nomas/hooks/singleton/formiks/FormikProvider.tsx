import React, { type PropsWithChildren } from "react"
import { useSwapFormikCore } from "./useSwapFormik"
import { createContext } from "react"
import { useFormik } from "formik"
import type { SwapFormikValues } from "./useSwapFormik"
import {
    useWithdrawFormikCore,
    type WithdrawFormikValues,
} from "./useWithdrawFormik"
import type { CreatePasswordFormikValues } from "./useCreatePasswordFormik"
import { useCreatePasswordFormikCore } from "./useCreatePasswordFormik"
import type { TransferFormikValues } from "./useTransferFormik"
import { useTransferFormikCore } from "./useTransferFormik"
import { useInputPasswordFormikCore, type InputPasswordFormikValues } from "./useInputPasswordFormik"

export interface FormikContextType {
  swapFormik: ReturnType<typeof useFormik<SwapFormikValues>>;
  withdrawFormik: ReturnType<typeof useFormik<WithdrawFormikValues>>;
  createPasswordFormik: ReturnType<typeof useFormik<CreatePasswordFormikValues>>;
  inputPasswordFormik: ReturnType<typeof useFormik<InputPasswordFormikValues>>;
  transferFormik: ReturnType<typeof useFormik<TransferFormikValues>>;
}

export const FormikContext = createContext<FormikContextType | undefined>(
    undefined,
)

export const FormikProvider = ({ children }: PropsWithChildren) => {
    const swapFormik = useSwapFormikCore()
    const withdrawFormik = useWithdrawFormikCore()
    const createPasswordFormik = useCreatePasswordFormikCore()
    const inputPasswordFormik = useInputPasswordFormikCore()
    const transferFormik = useTransferFormikCore()
    return (
        <FormikContext.Provider value={{ 
            swapFormik, 
            withdrawFormik, 
            createPasswordFormik, 
            inputPasswordFormik,
            transferFormik,
        }}>
            {children}
        </FormikContext.Provider>
    )
}
