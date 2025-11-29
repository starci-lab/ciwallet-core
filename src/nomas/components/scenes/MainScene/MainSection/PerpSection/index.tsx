import { NomasCard, NomasCardVariant, TransactionReceiptPage } from "@/nomas/components"
import { setPerpSectionPage, TransactionType, useAppDispatch, useAppSelector } from "@/nomas/redux"
import React, { useMemo } from "react"
import { PerpSectionPage } from "@/nomas/redux"
import { PerpPage } from "./PerpPage"
import { DepositPage } from "./FundsPage"
import { SelectAssetPage } from "./SelectAssetPage"
import { SourceChainPage } from "./SourceChainPage"
import { MarginModePage } from "./MarginModePage"
import { LeveragePage } from "./LeveragePage"
import { SelectOrderTypePage } from "./SelectOrderTypePage"
import { LongShortPage } from "./LongShortPage"
import { TakeProfitStopLossPage } from "./TakeProfitStopLossPage"
import { PositionPage } from "./PositionPage"
import { ClosePositionConfirmationPage } from "./ClosePositionConfirmationPage"
import { OrderPage } from "./OrderPage"
import { SelectAssetDepositPage } from "./SelectAssetDepositPage"
import { useHyperliquidDepositFormik } from "@/nomas/hooks"
import { hyperliquidObj } from "@/nomas/obj"

export const PerpSection = () => {
    const perpSectionPage = useAppSelector((state) => state.stateless.sections.perp.perpSectionPage)   
    const dispatch = useAppDispatch()
    const formik = useHyperliquidDepositFormik()
    const hyperliquidDepositAsset = useMemo(() => hyperliquidObj.getDepositAssetInfoByAsset(formik.values.asset), [formik.values.asset])
    const depositTxHash = useAppSelector((state) => state.stateless.sections.perp.depositTxHash)
    const depositSuccess = useAppSelector((state) => state.stateless.sections.perp.depositSuccess)
    const renderPage = () => {
        switch (perpSectionPage) {
        case PerpSectionPage.TransactionReceipt:
            return <TransactionReceiptPage 
                transactionData={{
                    type: TransactionType.Deposit,
                    chainId: hyperliquidDepositAsset.refs[0].chainId,
                    tokenId: hyperliquidDepositAsset.refs[0].tokenId,
                    amount: formik.values.amount,
                    txHash: depositTxHash ?? "",
                }}
                success={depositSuccess}
                showBackButton={true}
                onBackButtonPress={() => {
                    dispatch(setPerpSectionPage(PerpSectionPage.Perp))
                }}
            />
        case PerpSectionPage.Perp:
            return <PerpPage />
        case PerpSectionPage.Deposit:
            return <DepositPage />
        case PerpSectionPage.SelectAsset:
            return <SelectAssetPage />
        case PerpSectionPage.SourceChain:
            return <SourceChainPage />
        case PerpSectionPage.MarginMode:
            return <MarginModePage />
        case PerpSectionPage.Leverage:
            return <LeveragePage />
        case PerpSectionPage.OrderType:
            return <SelectOrderTypePage />
        case PerpSectionPage.LongShort:
            return <LongShortPage />
        case PerpSectionPage.TakeProfitStopLoss:
            return <TakeProfitStopLossPage />
        case PerpSectionPage.Position:
            return <PositionPage />
        case PerpSectionPage.ClosePositionConfirmation:
            return <ClosePositionConfirmationPage />
        case PerpSectionPage.Order:
            return <OrderPage />
        case PerpSectionPage.SelectAssetDeposit:
            return <SelectAssetDepositPage />
        }
    }
    return <NomasCard 
        variant={NomasCardVariant.Gradient} 
        isContainer
    >
        {renderPage()}
    </NomasCard>
}