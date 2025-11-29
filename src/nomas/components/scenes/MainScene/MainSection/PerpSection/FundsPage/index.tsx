import React, { useEffect } from "react"
import {
    NomasCardBody,
    NomasCardHeader,
    NomasSpacer,
    NomasTab,
} from "@/nomas/components"
import {
    PerpDepositTab,
    PerpSectionPage,
    selectSelectedAccountByPlatform,
    setDepositTab,
    setPerpSectionPage,
    useAppDispatch,
    useAppSelector,
} from "@/nomas/redux"
import { ChainId, Platform } from "@ciwallet-sdk/types"
import { useHyperliquidDepositFormik, useHyperunitGenerateAddressSwrMutation } from "@/nomas/hooks"
import { DepositSection } from "./DepositSection"
import { WithdrawSection } from "./WithdrawSection"

export const DepositPage = () => {
    const dispatch = useAppDispatch()
    const hyperunitGenerateAddressSwrMutation =
    useHyperunitGenerateAddressSwrMutation()
    const formik = useHyperliquidDepositFormik()
    // your destination account address
    const destinationAccount = useAppSelector((state) =>
        selectSelectedAccountByPlatform(
            state.persists,
            Platform.Evm
        )
    )
    const network = useAppSelector((state) => state.persists.session.network)
    useEffect(() => {
        const handleEffect = async () => {
            await hyperunitGenerateAddressSwrMutation.trigger({
                sourceChain: formik.values.chainId,
                destinationChain: ChainId.Hyperliquid,
                asset: formik.values.asset,
                destinationAddress: destinationAccount?.accountAddress || "",
                network,
            }, {
                populateCache: true,
            })
        }
        handleEffect()
    }, [
        formik.values.asset,
        formik.values.chainId,
        destinationAccount?.accountAddress,
    ])
    const depositTab = useAppSelector((state) => state.stateless.sections.perp.depositTab)
    const renderTabContent = () => {
        switch (depositTab) {
        case PerpDepositTab.Deposit:
            return <DepositSection />
        case PerpDepositTab.Withdraw:
            return <WithdrawSection />
        }
    }
    return (
        <>
            <NomasCardHeader
                title="Funds"
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setPerpSectionPage(PerpSectionPage.Perp))
                }}
            />
            <NomasCardBody>
                <NomasTab 
                    value={depositTab}
                    onValueChange={(value) => {
                        dispatch(setDepositTab(value as PerpDepositTab))
                    }}
                    tabs={[{
                        value: PerpDepositTab.Deposit,
                        label: "Deposit",
                    }, {
                        value: PerpDepositTab.Withdraw,
                        label: "Withdraw",
                    }]}
                />
                <NomasSpacer y={6} />   
                {renderTabContent()}
            </NomasCardBody>
            
        </>
    )
}
