import React from "react"
import { NomasCardHeader, NomasCardBody, NomasSpacer, TooltipTitle, NomasTab, NomasNumberTransparentInput, NomasSwitch } from "@/nomas/components"
import { setSwapFunctionPage, SwapFunctionPage, useAppDispatch } from "@/nomas/redux"
import { TransactionMode, useSwapFormik } from "@/nomas/hooks"
import { LightningIcon } from "@phosphor-icons/react"

export const SlippageConfigFunction = () => {
    const dispatch = useAppDispatch()
    const slippageMap = [
        { label: "0.1%", value: 0.1 },
        { label: "0.5%", value: 0.5 },
        { label: "1%", value: 1 },
    ]
    const formik = useSwapFormik()
    return (
        <>
            <NomasCardHeader
                title="Slippage"
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setSwapFunctionPage(SwapFunctionPage.Swap))
                }}
            />
            <NomasCardBody>
                <TooltipTitle title="Tolerance" size="sm" />
                <NomasSpacer y={2}/>
                <div className="flex grid grid-cols-5 gap-4">
                    <NomasTab value={formik.values.slippage.toString()}
                        className="col-span-3"
                        onValueChange={(value) => {
                            formik.setFieldValue("slippage", parseFloat(value))
                        }} tabs={slippageMap.map((slippage) => ({ label: slippage.label, value: slippage.value.toString() }))} />
                    <div className="bg-card-dark rounded-card-inner px-4 flex items-center gap-4 h-[52px] col-span-2">
                        <div className="text-sm text-muted">
                                Custom
                        </div>
                        <div className="flex items-center gap-2">
                            <NomasNumberTransparentInput
                                value={formik.values.slippage.toString()}
                                onValueChange={(value) => {
                                    formik.setFieldValue("slippage", value)
                                }}
                                className="w-full text-right !text-sm"
                                onBlur={() => {
                                    formik.setFieldTouched("slippage")
                                }}
                            />
                            <div className="text-sm">%</div>
                        </div>
                    </div>
                </div>
                <NomasSpacer y={4}/>
                <div className="flex items-center gap-4 grid grid-cols-5">
                    <TooltipTitle title="Transaction Mode" size="sm" className="col-span-2" />
                    <NomasTab value={formik.values.transactionMode} className="col-span-3"
                        onValueChange={(value) => {
                            formik.setFieldValue("transactionMode", value)
                        }} tabs={[{ 
                            label: "Default", 
                            value: TransactionMode.Default
                        }, 
                        { 
                            label: "Instant", 
                            value: TransactionMode.Instant,
                            renderLabel: () => (
                                <div className="flex items-center gap-2 text-sm">
                                    <LightningIcon className="w-5 h-5" /> Instant
                                </div>
                            )
                        }]} 
                    />
                </div>
                <NomasSpacer y={4}/>
                {
                    formik.values.transactionMode === TransactionMode.Default && (
                        <div className="text-sm text-text-muted-dark">
                            Standard gas based on real-time network conditions
                        </div>
                    )
                }
                <NomasSpacer y={4}/>
                <TooltipTitle title="MEV Protection" size="sm" />
                <NomasSpacer y={4}/>
                <div className="flex items-center justify-between">
                    <TooltipTitle title="Enable" size="sm" className="text" />
                    <NomasSwitch 
                        addConfetti 
                        checked={formik.values.mevProtection} 
                        onCheckedChange={(checked) => {
                            formik.setFieldValue("mevProtection", checked)
                        }} />
                </div>
            </NomasCardBody>
        </> 
    )
}