import { NomasCard, NomasCardBody, NomasCardHeader, NomasCardVariant } from "@/nomas/components/extends"
import { SelectChainTab } from "@/nomas/components"
import { DepositInfo } from "./DepositInfo"
import { setDepositSelectedChainId, useAppDispatch, useAppSelector } from "@/nomas/redux"

export const DepositFunction = () => {
    const selectedChainId = useAppSelector((state) => state.stateless.sections.deposit.selectedChainId)
    const dispatch = useAppDispatch()
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
                    isSelected={(chainId) => selectedChainId === chainId}
                    onSelect={(chainId) => {
                        dispatch(setDepositSelectedChainId(chainId))
                    }}
                />
            </NomasCardBody>
            <NomasCardBody>
                <DepositInfo selectedChainId={selectedChainId} />
            </NomasCardBody>
        </NomasCard>
    )
}