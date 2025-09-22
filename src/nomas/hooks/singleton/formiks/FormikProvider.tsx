import React, {
    type PropsWithChildren,
} from "react"
import { useSwapFormikCore } from "./useSwapFormik"
import { createContext } from "react"
import { useFormik } from "formik"
import type { SwapFormikValues } from "./useSwapFormik"

export interface FormikContextType {
    swapFormik: ReturnType<typeof useFormik<SwapFormikValues>>;
}
  
export const FormikContext = createContext<FormikContextType | undefined>(
    undefined
)

export const FormikProvider = ({ children }: PropsWithChildren) => {
    const swapFormik = useSwapFormikCore()
    return (
        <FormikContext.Provider value={{ swapFormik }}>
            {children}
        </FormikContext.Provider>
    )
}

