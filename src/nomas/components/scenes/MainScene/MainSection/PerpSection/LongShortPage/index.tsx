import React from "react"
import { 
    NomasCardHeader, 
    NomasCardBody, 
    NomasInput,
    NomasCard,
    NomasCardVariant,
    PressableMotion, 
    NomasSpacer,
} from "@/nomas/components"
import { PerpSectionPage, setPerpSectionPage, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { hyperliquidObj } from "@/nomas/obj"
import { useMemo } from "react"
import { HyperliquidOrderSide } from "@ciwallet-sdk/classes"
import { usePlacePerpOrderFormik } from "@/nomas/hooks"
import { CaretRightIcon } from "@phosphor-icons/react"
import { SizeDropdown } from "./SizeDropdown"


export const LongShortPage = () => {
    const dispatch = useAppDispatch()   
    const selectedAssetId = useAppSelector((state) => state.stateless.sections.perp.selectedAssetId)
    const assetMetadata = useMemo(() => hyperliquidObj.getAssetMetadata(selectedAssetId), [selectedAssetId])
    const orderSide = useAppSelector((state) => state.stateless.sections.perp.orderSide)
    const renderTitle = useMemo(() => {
        return orderSide === HyperliquidOrderSide.Buy ? "Long" : "Short" 
    }, [orderSide])
    const formik = usePlacePerpOrderFormik()
    const leverage = useAppSelector((state) => state.stateless.sections.perp.leverage)
    const isCross = useAppSelector((state) => state.stateless.sections.perp.isCross)
    const orderType = useAppSelector((state) => state.stateless.sections.perp.orderType)
    const orderTypeMetadata = useMemo(() => hyperliquidObj.getOrderTypeMetadata()[orderType], [orderType])
    return (
        <>
            <NomasCardHeader
                title={`${renderTitle} ${assetMetadata.name}`}
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setPerpSectionPage(PerpSectionPage.Perp))
                }}
            />
            <NomasCardBody> 
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <NomasCardBody className="p-4 flex items-center justify-between gap-4">
                        <div className="flex justify-start flex-1">
                            <PressableMotion
                                onClick={() => {
                                    dispatch(setPerpSectionPage(PerpSectionPage.MarginMode))
                                }}
                                className="flex items-center gap-2"
                            >
                                <div className="text-sm">
                                    {isCross ? "Cross" : "Isolated"}
                                </div>
                                <CaretRightIcon className="size-4 text-text-muted" />
                            </PressableMotion>
                        </div>
                        <div className="flex justify-center flex-1">  
                            <PressableMotion
                                onClick={() => {
                                    dispatch(setPerpSectionPage(PerpSectionPage.OrderType))
                                }}
                                className="flex items-center gap-2"
                            >
                                <div className="text-sm">
                                    {orderTypeMetadata.name}
                                </div>
                                <CaretRightIcon className="size-4 text-text-muted" />
                            </PressableMotion>
                        </div>
                        <div className="flex justify-end flex-1">
                            <PressableMotion
                                onClick={() => {
                                    dispatch(setPerpSectionPage(PerpSectionPage.Leverage))
                                }}
                                className="flex items-center gap-2"
                            >
                                <div className="text-sm">
                                    {leverage}x
                                </div>
                                <CaretRightIcon className="size-4 text-text-muted" />
                            </PressableMotion>
                        </div>
                    </NomasCardBody>
                </NomasCard>
                <NomasSpacer y={4} />
                <NomasInput
                    prefixIcon={<div className="text-text-muted text-sm">Size</div>}
                    value={`${formik.values.amount}`}
                    textAlign="right"
                    onValueChange={(value) => {
                        formik.setFieldValue("amount", value)
                    }}
                    numericOnly
                    postfixIcon={
                        <SizeDropdown />
                    }
                    className="w-full"
                />
            </NomasCardBody>
        </>
    )
}