import { NomasCard, NomasCardBody, NomasCardFooter, NomasCardHeader, NomasCardVariant, NomasInput, NomasLink, NomasSpacer, NomasWarningText } from "@/nomas/components"
import { NomasButton } from "@/nomas/components"
import { PerpSectionPage, setPerpSectionPage, useAppSelector } from "@/nomas/redux"
import { useAppDispatch } from "@/nomas/redux"
import React from "react"
import { usePlacePerpOrderFormik } from "@/nomas/hooks"
import { XCircleIcon } from "@phosphor-icons/react"

export const TakeProfitStopLossPage = () => {
    const dispatch = useAppDispatch()
    const activeAssetCtx = useAppSelector((state) => state.stateless.sections.perp.activeAssetCtx)
    const formik = usePlacePerpOrderFormik()
    return (
        <NomasCard>
            <NomasCardHeader title={"TP/SL Settings"} showBackButton onBackButtonPress={() => {
                dispatch(setPerpSectionPage(PerpSectionPage.LongShort))
                if (formik.values.takeProfitSnapshot !== formik.values.takeProfit) {
                    formik.setFieldValue("takeProfit", formik.values.takeProfitSnapshot)
                }
                if (formik.values.stopLossSnapshot !== formik.values.stopLoss) {
                    formik.setFieldValue("stopLoss", formik.values.stopLossSnapshot)
                }
            }} />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <NomasCardBody className="p-4">
                        <div className="text-xs text-text-muted">
                            Mark Price: ${activeAssetCtx?.ctx.markPx}
                        </div>
                        <NomasSpacer y={4} />
                        <div>
                            <div className="flex items-center gap-2 justify-between">
                                <NomasInput
                                    value={formik.values.takeProfit}
                                    textAlign="right"
                                    onValueChange={(value) => {
                                        formik.setFieldValue("takeProfit", value)
                                    }}
                                    onBlur={() => {
                                        formik.setFieldTouched("takeProfit", true)
                                    }}
                                    postfixIcon={
                                        formik.values.takeProfit && (
                                            <NomasLink onClick={() => {
                                                formik.setFieldValue("takeProfit", "")
                                                formik.setFieldTouched("takeProfit", false)
                                            }}>
                                                <XCircleIcon weight="fill" className="size-5 text-text-muted" />
                                            </NomasLink>
                                        )
                                    }
                                    isInvalid={!!(formik.errors.takeProfit && formik.touched.takeProfit)}
                                    numericOnly
                                    className="w-full"
                                    prefixIcon={
                                        <div className="text-sm">
                                        TP
                                        </div>
                                    }
                                />
                                <NomasInput
                                    value={formik.values.takeProfitGain}
                                    textAlign="right"
                                    numericOnly
                                    className="w-full"
                                    prefixIcon={
                                        <div className="text-sm text-text-muted">
                                        Gain
                                        </div>
                                    }
                                    postfixIcon={
                                        "$"
                                    }
                                />
                            </div>
                            {
                                !!(formik.errors.takeProfit && formik.touched.takeProfit) && (
                                    <> 
                                        <NomasSpacer y={2} />
                                        <NomasWarningText>{formik.errors.takeProfit}</NomasWarningText>
                                    </>
                                )}
                        </div>
                        <NomasSpacer y={4} />
                        <div>
                            <div className="flex items-center gap-2 justify-between">
                                <NomasInput
                                    value={formik.values.stopLoss}
                                    prefixIcon={
                                        <div className="text-sm text-text-muted">
                                        SL
                                        </div>
                                    }
                                    textAlign="right"
                                    onValueChange={(value) => {
                                        formik.setFieldValue("stopLoss", value)
                                    }}
                                    onBlur={() => {
                                        formik.setFieldTouched("stopLoss", true)
                                    }}
                                    isInvalid={!!(formik.errors.stopLoss && formik.touched.stopLoss)}
                                    numericOnly
                                    className="w-full"
                                    postfixIcon={
                                        formik.values.stopLoss && (
                                            <NomasLink onClick={() => {
                                                formik.setFieldValue("stopLoss", "")
                                                formik.setFieldTouched("stopLoss", false)
                                            }}>
                                                <XCircleIcon weight="fill" className="size-5 text-text-muted" />
                                            </NomasLink>
                                        )
                                    }
                                />
                                <NomasInput
                                    value={formik.values.stopLossLoss}
                                    postfixIcon={
                                        "$"
                                    }
                                    textAlign="right"
                                    numericOnly
                                    className="w-full"
                                    prefixIcon={
                                        <div className="text-sm text-text-muted">
                                        Loss
                                        </div>
                                    }
                                />
                            </div>
                            {
                                !!(formik.errors.stopLoss && formik.touched.stopLoss) && (
                                    <> 
                                        <NomasSpacer y={2} />
                                        <NomasWarningText>{formik.errors.stopLoss}</NomasWarningText>
                                    </>
                                )}
                        </div>
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
            <NomasCardFooter>
                <NomasButton xlSize className="w-full" 
                    onClick={() => {
                        formik.setFieldValue("isTakeProfitAndStopLoss", true)
                        dispatch(setPerpSectionPage(PerpSectionPage.LongShort))
                        formik.setFieldValue("takeProfitSnapshot", formik.values.takeProfit)
                        formik.setFieldValue("stopLossSnapshot", formik.values.stopLoss)
                    }}>
                    Confirm
                </NomasButton>
            </NomasCardFooter>
        </NomasCard>
    )
}