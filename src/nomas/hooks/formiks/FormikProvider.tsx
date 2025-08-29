import React, {
    type PropsWithChildren,
} from "react"
import { useSwapFormikCore } from "./useSwapFormik"
import { FormikContext } from "./core"

export const FormikProvider = ({ children }: PropsWithChildren) => {
    const swapFormik = useSwapFormikCore()

    return (
        <FormikContext.Provider value={{ swapFormik }}>
            {children}
        </FormikContext.Provider>
    )
}

