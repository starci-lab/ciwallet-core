import { useFormik } from "formik"
import * as Yup from "yup"
import Decimal from "decimal.js"
import { useContext, useEffect } from "react"
import { FormikContext } from "./FormikProvider"
import { useHyperliquidPlaceOrderSwrMutatation } from "../hyperliquid"
import { useAppSelector } from "@/nomas/redux"
import { HyperliquidOrderSide } from "@ciwallet-sdk/classes"
import { roundNumber } from "@/nomas/utils/math"

export interface PlacePerpOrderFormikValues {
    amount: string
    balanceAmount: string
    amountPercentage: number
    isReduceOnly: boolean
    markPx: number
    isTakeProfitAndStopLoss: boolean
    takeProfit: string
    stopLoss: string
    takeProfitGain: string
    stopLossLoss: string
    useUsdc: boolean
    isLong: boolean
    takeProfitSnapshot: string
    stopLossSnapshot: string
}

export const usePlacePerpOrderFormikCore = () => {
    const hyperliquidPlaceOrderSwrMutatation = useHyperliquidPlaceOrderSwrMutatation()
    const activeAssetCtx = useAppSelector((state) => state.stateless.sections.perp.activeAssetCtx)
    const orderSide = useAppSelector((state) => state.stateless.sections.perp.orderSide)
    const leverage = useAppSelector((state) => state.stateless.sections.perp.leverage)
    const formik = useFormik<PlacePerpOrderFormikValues>({
        initialValues: {
            amount: "0",
            balanceAmount: "0",
            amountPercentage: 0,
            isReduceOnly: false,
            isTakeProfitAndStopLoss: false,
            markPx: 0,
            takeProfit: "",
            stopLoss: "",
            takeProfitGain: "",
            stopLossLoss: "",
            useUsdc: true,
            isLong: true,
            takeProfitSnapshot: "",
            stopLossSnapshot: "",
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
            takeProfit: Yup.string()
                .nullable()
                .test(
                    "takeProfit-format",
                    "Invalid take profit value",
                    (value) => {
                        if (!value) return true // empty allowed
                        return new Decimal(value).isFinite()
                    }
                )
                .when("isLong", (isLong, schema) => {
                    return schema.test(
                        "takeProfit-vs-mark-price",
                        isLong
                            ? "Take profit must be greater than mark price"
                            : "Take profit must be less than mark price",
                        function (value) {
                            if (!value) return true // empty allowed

                            const tp = new Decimal(value)
                            const px = new Decimal(this.parent.markPx ?? 0)

                            return isLong ? tp.gt(px) : tp.lt(px)
                        }
                    )
                }),
            stopLoss: Yup.string()
                .nullable()
                .test(
                    "stopLoss-format",
                    "Invalid stop loss value",
                    (value) => {
                        if (!value) return true // allow empty
                        try {
                            return new Decimal(value).isFinite()
                        } catch {
                            return false
                        }
                    }
                )
                .when("isLong", (isLong, schema) => {
                    return schema.test(
                        "stopLoss-vs-mark-price",
                        isLong
                            ? "Stop loss must be less than mark price"
                            : "Stop loss must be greater than mark price",
                        function (value) {
                            if (!value) return true // allow empty

                            const sl = new Decimal(value)
                            const mark = new Decimal(this.parent.markPx ?? 0)
            
                            return isLong ? sl.lt(mark) : sl.gt(mark)
                        }
                    )
                }),
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
            "markPx",
            activeAssetCtx?.ctx.markPx ?? 0
        )
    }, [activeAssetCtx?.ctx.markPx])

    useEffect(() => {
        const { takeProfit, markPx, amount, isLong } = formik.values
        if (!takeProfit) {
            formik.setFieldValue("takeProfitGain", "")
            return
        }
        const tp = new Decimal(takeProfit)
        const px = new Decimal(markPx)

        let diff: Decimal

        if (isLong) {
            if (tp.lte(px)) return
            diff = tp.sub(px)
        } else {
            if (tp.gte(px)) return
            diff = px.sub(tp)
        }

        formik.setFieldValue(
            "takeProfitGain",
            roundNumber(diff.div(px).mul(amount).mul(leverage).toNumber(), 3)
        )
    }, [
        formik.values.markPx,
        formik.values.takeProfit,
        formik.values.isLong,
        formik.values.amount,
        leverage,
    ])

    useEffect(() => {
        const { stopLoss, markPx, amount, isLong } = formik.values
        if (!stopLoss) {
            formik.setFieldValue("stopLossLoss", "")
            return
        }
        const sl = new Decimal(stopLoss)
        const px = new Decimal(markPx)
        let diff: Decimal
        if (isLong) {
            if (sl.gte(px)) return
            diff = px.sub(sl)
        } else {
            if (sl.lte(px)) return
            diff = sl.sub(px)
        }
        formik.setFieldValue(
            "stopLossLoss",
            roundNumber(diff.div(px).mul(amount).mul(leverage).toNumber(), 3)
        )
    }, [
        formik.values.markPx, 
        formik.values.stopLoss, 
        formik.values.isLong, 
        formik.values.amount, 
        leverage
    ])

    useEffect(() => {
        formik.setFieldValue(
            "isLong",
            orderSide === HyperliquidOrderSide.Buy
        )
    }, [orderSide])
    return formik
}

export const usePlacePerpOrderFormik = () => {
    const context = useContext(FormikContext)
    if (!context) {
        throw new Error("usePlacePerpOrderFormik must be used within a FormikProvider")
    }
    return context.placePerpOrderFormik
}   