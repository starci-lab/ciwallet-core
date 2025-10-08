import {
    NomasCard,
    NomasCardBody,
    NomasCardHeader,
} from "../../../../../../extends"
import {
    useAppSelector,
    useAppDispatch,
    setWithdrawPage,
    WithdrawPage,
} from "@/nomas/redux"
import { useWithdrawFormik } from "@/nomas/hooks/singleton/formiks"
import { useEffect, useState } from "react"
import type { Token } from "@ciwallet-sdk/types"
import { TokenCardWithdraw } from "../TokenCardWithdraw"

export const ChooseTokenTab = () => {
    const dispatch = useAppDispatch()
    const withdrawFormik = useWithdrawFormik()

    const chainManager = useAppSelector((state) => state.stateless.withdraw.chainManager)
    const tokenManager = useAppSelector((state) => state.stateless.withdraw.tokenManager)
    const network = useAppSelector((state) => state.persist.session.network)
    const chainMetadata = chainManager.getChainById(
        withdrawFormik.values.chainId,
    )

    const [tokens, setTokens] = useState<Token[]>([])

    useEffect(() => {
        setTokens(
            tokenManager.getTokensByChainIdAndNetwork(chainMetadata!.id, network),
        )
    }, [chainMetadata, network, tokenManager])

    return (
        <NomasCard className="bg-content2-100 border-1 border-foreground-700">
            <NomasCardHeader title="Choose Token" />

            <NomasCardBody className="flex flex-col gap-2">
                {tokens.map((token) => (
                    <TokenCardWithdraw
                        key={token.tokenId}
                        token={token}
                        chainId={chainMetadata!.id}
                        isPressable
                        onPress={() => {
                            withdrawFormik.setFieldValue("tokenId", token.tokenId)
                            dispatch(setWithdrawPage(WithdrawPage.InitWithdraw))
                        }}
                    />
                ))}
            </NomasCardBody>
        </NomasCard>
    )
}
