import { NomasCard, NomasCardBody, NomasCardHeader, NomasCardVariant } from "@/nomas/components/extends"
import { SelectChainTab } from "@/nomas/components"
import { DepositInfo } from "./DepositInfo"
import { setDepositSelectedChainId, useAppDispatch, useAppSelector } from "@/nomas/redux"

export const DepositFunction = () => {
    const dispatch = useAppDispatch()
    const depositSelectedChainId = useAppSelector((state) => state.stateless.sections.home.depositSelectedChainId)
    //TODO: Remove the mt-4 later
    return (
        <NomasCard variant={NomasCardVariant.Gradient} className="max-w-md mx-auto mt-4">
            <NomasCardHeader
                title="Deposit"
                showBackButton
                onBackButtonPress={() => {}}
            />
            <NomasCardBody>
                <SelectChainTab
                    isSelected={(chainId) => depositSelectedChainId === chainId}
                    onSelect={(chainId) => {
                        dispatch(setDepositSelectedChainId(chainId))
                    }}
                />
            </NomasCardBody>
            <NomasCardBody>
                <DepositInfo selectedChainId={depositSelectedChainId} />
            </NomasCardBody>
        </NomasCard>
    )
}