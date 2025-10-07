import useSWR from "swr"
import {
    NomasButton,
    NomasCard,
    NomasCardBody,
    NomasCardHeader,
} from "../../../../../extends"
import { InitWithdraw } from "./InitWithdraw"
import { ProcessTransaction } from "./ProcessTransaction"
import { ResultTransaction } from "./ResultTransaction"
import { SignTransaction } from "./SignTransaction"
import { useSwapFormik } from "@/nomas/hooks"
import {
    setWithdrawPage,
    useAppDispatch,
    useAppSelector,
    WithdrawPage,
} from "@/nomas/redux"
import { useBalance } from "@ciwallet-sdk/hooks"
import { ChooseTokenTab } from "./ChooseTokenTab"

export const WithdrawFunction = () => {
    const dispatch = useAppDispatch()
    const withdrawPage = useAppSelector((state) => state.stateless.pages.withdrawPage)

    const pageRender = () => {
        switch (withdrawPage) {
        case WithdrawPage.InitWithdraw:
            return <InitWithdraw />
        case WithdrawPage.SignTransaction:
            return <SignTransaction />
        case WithdrawPage.ProcessTransaction:
            return <ProcessTransaction />
        case WithdrawPage.ResultTransaction:
            return <ResultTransaction />
        case WithdrawPage.ChooseTokenTab:
            return <ChooseTokenTab />
        }
    }

    return (
        <>
            <NomasCard asCore className="">
                <NomasCardHeader
                    title="Withdraw"
                    showBackButton
                    onBackButtonPress={() => {
                        dispatch(setWithdrawPage(WithdrawPage.InitWithdraw))
                    }}
                />
                <NomasCardBody>
                    {pageRender()}
                    {/* <InitWithdraw /> */}
                    {/* <SignTransaction /> */}
                    {/* <ProcessTransaction /> */}

                    {/* <ResultTransaction /> */}
                </NomasCardBody>
            </NomasCard>
        </>
    )
}
