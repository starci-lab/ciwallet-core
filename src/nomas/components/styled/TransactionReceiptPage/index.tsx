import React from "react"
import { 
    NomasCardHeader, 
    NomasCardBody, 
    NomasCard, 
    NomasCardVariant,
    NomasButton
} from "../../extends"
import type { TransactionData, TransactionType } from "@/nomas/redux"

export interface TransactionReceiptPageProps {
    showBackButton?: boolean
    onBackButtonPress?: () => void
    onProceedButtonClick?: () => void
    transactionData?: TransactionData
    type: TransactionType
}

export const TransactionReceiptPage = ({ 
    showBackButton, 
    onBackButtonPress, 
    onProceedButtonClick, 
    transactionData, 
    type
}: TransactionReceiptPageProps) => {
    return (
        <>
            <NomasCardHeader
                title="Choose Network"
                showBackButton={showBackButton}
                onBackButtonPress={onBackButtonPress}
            />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner className="p-4">
                    <NomasCardBody className="p-0 flex flex-col gap-2">
                        {transactionData?.type}
                    </NomasCardBody>
                    <NomasButton
                        onClick={onProceedButtonClick}
                        xlSize
                    >
                        Proceed
                    </NomasButton>
                </NomasCard>
            </NomasCardBody>
        </>
    )
}

export default TransactionReceiptPage