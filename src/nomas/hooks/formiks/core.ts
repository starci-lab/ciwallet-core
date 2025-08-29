import { createContext, useContext } from "react"
import { useFormik } from "formik"
import type { SwapFormikValues } from "./useSwapFormik"

export interface FormikContextType {
    swapFormik: ReturnType<typeof useFormik<SwapFormikValues>>;
}
  
export const FormikContext = createContext<FormikContextType | undefined>(
    undefined
)

export const useSwapFormik = () => {
    const context = useContext(FormikContext)
    if (!context) {
        throw new Error(
            "useSwapFormik must be used within a FormikProvider"
        )
    }
    return context.swapFormik
}