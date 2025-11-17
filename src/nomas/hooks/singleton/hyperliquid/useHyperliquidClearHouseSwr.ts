import { infoHyperliquidObj } from "@/nomas/obj"
import { 
    setClearingHouseData, 
    useAppDispatch, 
    useAppSelector 
} from "@/nomas/redux"
import { Platform } from "@ciwallet-sdk/types"
import { selectSelectedAccountByPlatform } from "@/nomas/redux"
import useSWR from "swr"
export const useHyperliquidClearHouseSwrCore = () => {
    const network = useAppSelector((state) => state.persists.session.network)
    const selectedAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, Platform.Evm))
    const dispatch = useAppDispatch()
    return useSWR(
        ["hyperliquid-clearing-house", network, selectedAccount?.accountAddress],
        async () => {
            const clearingHouseData = await infoHyperliquidObj.getClearingHouseData({
                clientParams: { network },
                accountAddress: selectedAccount?.accountAddress || "",
            })
            dispatch(setClearingHouseData(clearingHouseData))
        }
    )
}