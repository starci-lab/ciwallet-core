import {
    NomasButton,
    NomasCard,
    NomasCardBody,
    NomasDivider,
} from "../../../../extends"
import {
    useAppSelector,
    useAppDispatch,
    setWithdrawPage,
    WithdrawPageState,
} from "@/nomas/redux"
import { SpinnerGapIcon } from "@phosphor-icons/react"
import { useWithdrawFormik } from "@/nomas/hooks/singleton/formiks"
import { useEffect, useRef } from "react"

export const ProcessTransaction = () => {
    const dispatch = useAppDispatch()
    const withdrawFormik = useWithdrawFormik()

    const chainManager = useAppSelector((state) => state.chain.manager)
    const tokenManager = useAppSelector((state) => state.token.manager)
    const token = tokenManager.getTokenById(withdrawFormik.values.tokenId)
    const hasSubmitted = useRef(false)

    useEffect(() => {
        if (hasSubmitted.current) return
        hasSubmitted.current = true
        withdrawFormik.submitForm()
    }, [])

    return (
        <>
            <NomasCard className="bg-content2-100 border-1 border-black">
                <NomasCardBody>
                    <NomasCard className="bg-content2-100 text-foreground-700">
                        <NomasCardBody>
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-foreground-100 text-xl">
                  Sending {token?.symbol}
                                </p>
                                <SpinnerGapIcon className="h-13 w-13 animate-spin" />

                                <p className="text-foreground-100 text-2xl">
                                    {withdrawFormik.values.amount}
                                </p>
                                <p className="text-foreground-100">
                  ${(parseFloat(withdrawFormik.values.amount) * 3.5).toFixed(4)}
                                </p>
                            </div>
                        </NomasCardBody>
                    </NomasCard>
                </NomasCardBody>
            </NomasCard>
            <NomasDivider className="my-3" />
            <NomasButton
                className="py-6 border-1 border-foreground-700"
                onPress={() => {
                    console.log("Cancel Process")
                }}
            >
        Cancel
            </NomasButton>
        </>
    )
}
