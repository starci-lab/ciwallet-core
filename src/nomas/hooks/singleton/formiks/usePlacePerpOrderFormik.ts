import { useFormik } from "formik"
import * as Yup from "yup"
import Decimal from "decimal.js"
import { useContext, useEffect } from "react"
import { FormikContext } from "./FormikProvider"
import { useHyperliquidPlaceOrderSwrMutatation } from "../hyperliquid"

export interface PlacePerpOrderFormikValues {
    amount: string
    balanceAmount: string
    amountPercentage: number
    isReduceOnly: boolean
    isTakeProfitAndStopLoss: boolean
    takeProfit: string
    stopLoss: string
    takeProfitPercentage: number
    stopLossPercentage: number
    useUsdc: boolean
}

export const usePlacePerpOrderFormikCore = () => {
    const hyperliquidPlaceOrderSwrMutatation = useHyperliquidPlaceOrderSwrMutatation()
    const formik = useFormik<PlacePerpOrderFormikValues>({
        initialValues: {
            amount: "0",
            balanceAmount: "0",
            amountPercentage: 0,
            isReduceOnly: false,
            isTakeProfitAndStopLoss: false,
            takeProfit: "0",
            stopLoss: "0",
            takeProfitPercentage: 0,
            stopLossPercentage: 0,
            useUsdc: true,
        },
        validationSchema: Yup.object({
            amount: Yup.string()
                .required("Amount is required")
                .test(
                    "amount-less-than-balance",
                    "Amount must be less than or equal to balance",
                    function (value) {
                        const { balanceAmount } = this.parent
                        const amountNum = new Decimal(value || "0")
                        const balanceNum = new Decimal(balanceAmount || "0")
                        return amountNum.lte(balanceNum)
                    }
                ),
            balanceAmount: Yup.string().required("Balance is required"),
        }),
        onSubmit: async (values) => {
            await hyperliquidPlaceOrderSwrMutatation?.trigger({
                price: "113000",
                size: values.amount,
                reduceOnly: values.isReduceOnly,
            })
        },
    })
    useEffect(() => {
        formik.setFieldValue(
            "amount", 
            new Decimal(formik.values.balanceAmount).mul(formik.values.amountPercentage / 100).toString()
        )
    }, [formik.values.balanceAmount, formik.values.amountPercentage])

    useEffect(() => {
        formik.setFieldValue(
            "takeProfit",
            new Decimal(formik.values.amount).mul(formik.values.takeProfitPercentage / 100).toString()
        )
    }, [formik.values.amount, formik.values.takeProfitPercentage])

    useEffect(() => {
        formik.setFieldValue(
            "stopLoss",
            new Decimal(formik.values.amount).mul(formik.values.stopLossPercentage / 100).toString()
        )
    }, [formik.values.amount, formik.values.stopLossPercentage])

    return formik
}

export const usePlacePerpOrderFormik = () => {
    const context = useContext(FormikContext)
    if (!context) {
        throw new Error("usePlacePerpOrderFormik must be used within a FormikProvider")
    }
    return context.placePerpOrderFormik
}   