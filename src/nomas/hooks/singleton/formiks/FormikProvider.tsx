import React, { type PropsWithChildren } from "react"
import { useSwapFormikCore } from "./useSwapFormik"
import { createContext } from "react"
import { useFormik } from "formik"
import type { SwapFormikValues } from "./useSwapFormik"
import type { CreatePasswordFormikValues } from "./useCreatePasswordFormik"
import { useCreatePasswordFormikCore } from "./useCreatePasswordFormik"
import type { TransferFormikValues } from "./useTransferFormik"
import { useTransferFormikCore } from "./useTransferFormik"
import { useInputPasswordFormikCore, type InputPasswordFormikValues } from "./useInputPasswordFormik"
import { useInputPrivateKeyFormikCore, type InputPrivateKeyFormikValues } from "./useInputPrivateKey"
import { useInputMnemonicFormikCore, type InputMnemonicFormikValues } from "./useInputMnemonicFormik"
import { useCreateMnemonicFormikCore, type CreateMnemonicFormikValues } from "./useCreateMnemonicFormik"
import { useHyperliquidDepositFormikCore, type HyperliquidDepositFormikValues } from "./useHyperliquidDepositFormik"

export interface FormikContextType {
  swapFormik: ReturnType<typeof useFormik<SwapFormikValues>>;
  createPasswordFormik: ReturnType<typeof useFormik<CreatePasswordFormikValues>>;
  inputPasswordFormik: ReturnType<typeof useFormik<InputPasswordFormikValues>>;
  transferFormik: ReturnType<typeof useFormik<TransferFormikValues>>;
  inputPrivateKeyFormik: ReturnType<typeof useFormik<InputPrivateKeyFormikValues>>;
  inputMnemonicFormik: ReturnType<typeof useFormik<InputMnemonicFormikValues>>;
  createMnemonicFormik: ReturnType<typeof useFormik<CreateMnemonicFormikValues>>;
  hyperliquidDepositFormik: ReturnType<typeof useFormik<HyperliquidDepositFormikValues>>;
}


export const FormikContext = createContext<FormikContextType | undefined>(
    undefined,
)

export const FormikProvider = ({ children }: PropsWithChildren) => {
    const swapFormik = useSwapFormikCore()
    const createPasswordFormik = useCreatePasswordFormikCore()
    const inputPasswordFormik = useInputPasswordFormikCore()
    const transferFormik = useTransferFormikCore()
    const inputPrivateKeyFormik = useInputPrivateKeyFormikCore()
    const inputMnemonicFormik = useInputMnemonicFormikCore()
    const createMnemonicFormik = useCreateMnemonicFormikCore()
    const hyperliquidDepositFormik = useHyperliquidDepositFormikCore()
    return (
        <FormikContext.Provider value={{ 
            swapFormik, 
            createPasswordFormik, 
            inputPasswordFormik,
            transferFormik,
            inputPrivateKeyFormik,
            inputMnemonicFormik,
            createMnemonicFormik,
            hyperliquidDepositFormik,
        }}>
            {children}
        </FormikContext.Provider>
    )
}
