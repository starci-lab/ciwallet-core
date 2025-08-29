import { useFormik } from "formik"
import * as Yup from "yup"
import { ChainId, TokenId } from "@ciwallet-sdk/types"

export interface SwapFormikValues {
    balanceIn: number
    balanceOut: number
    tokenIn: TokenId
    tokenOut: TokenId
    tokenInChainId: ChainId
    tokenOutChainId: ChainId
    isInput: boolean
    amountIn: string
    amountOut: string
    slippage: number
    tokenInFocused: boolean
}

const swapValidationSchema = Yup.object({
    balanceIn: Yup.number()
        .min(0, "Balance In must be more or equal to 0")
        .required("Balance In is required"),
    balanceOut: Yup.number()
        .min(0, "Balance Out must be more or equal to 0")
        .required("Balance Out is required"),
    tokenIn: Yup.string()
        .required("Token In is required")
        .notOneOf([Yup.ref("tokenOut")], "Token In and Token Out cannot be the same"),
    tokenOut: Yup.string().required("Token Out is required"),
    amountIn: Yup.number()
        .moreThan(0, "Amount In must be > 0")
        .required("Amount In is required")
        .test(
            "amountIn-less-than-balance",
            "Amount In cannot exceed Balance In",
            function (value) {
                const { balanceIn } = this.parent
                return value !== undefined && value <= balanceIn
            }
        ),
    amountOut: Yup.number()
        .moreThan(0, "Amount Out must be > 0")
        .required("Amount Out is required"),
    slippage: Yup.number()
        .moreThan(0, "Slippage must be > 0")
        .max(100, "Slippage must be ≤ 100")
        .required("Slippage is required"),
})

export const useSwapFormikCore = () => {
    return useFormik<SwapFormikValues>({
        initialValues: {
            balanceIn: 0,
            balanceOut: 0,
            tokenIn: TokenId.MonadTestnetUsdc,
            tokenOut: TokenId.MonadTestnetMon,
            tokenInChainId: ChainId.Monad,
            tokenOutChainId: ChainId.Monad,
            isInput: true,
            amountIn: "0",
            amountOut: "0",
            slippage: 0.5,
            tokenInFocused: false,
        },
        validationSchema: swapValidationSchema,
        onSubmit: (values) => {
            console.log(values)
        },
    })
}