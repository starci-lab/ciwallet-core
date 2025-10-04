import React, { type PropsWithChildren } from "react"
import { useSwapFormikCore } from "./useSwapFormik"
import { createContext } from "react"
import { useFormik } from "formik"
import type { SwapFormikValues } from "./useSwapFormik"
import {
    useWithdrawFormikCore,
    type WithdrawFormikValues,
} from "./withdrawFormik"

export interface FormikContextType {
  swapFormik: ReturnType<typeof useFormik<SwapFormikValues>>;
  withdrawFormik: ReturnType<typeof useFormik<WithdrawFormikValues>>;
}

export const FormikContext = createContext<FormikContextType | undefined>(
    undefined,
)

export const FormikProvider = ({ children }: PropsWithChildren) => {
    const swapFormik = useSwapFormikCore()
    const withdrawFormik = useWithdrawFormikCore()
    return (
        <FormikContext.Provider value={{ swapFormik, withdrawFormik }}>
            {children}
        </FormikContext.Provider>
    )
}
