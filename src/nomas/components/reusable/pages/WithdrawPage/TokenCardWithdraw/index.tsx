import {
    NomasAvatar,
    NomasCard,
    NomasCardBody,
    NomasCardHeader,
    NomasSpinner,
} from "../../../../extends"
import { ChainId, type Token } from "@ciwallet-sdk/types"
import { useBalance } from "@ciwallet-sdk/hooks"
import useSWR from "swr"
import { useAppSelector } from "@/nomas/redux"
import { roundNumber, shortenAddress } from "@ciwallet-sdk/utils"
import { useWithdrawFormik } from "@/nomas/hooks/singleton/formiks"

export interface TokenCardWithdrawProps {
  token: Token;
  chainId: ChainId;
  onPress?: () => void;
  isPressable?: boolean;
}

export const TokenCardWithdraw = ({
    token,
    chainId,
    onPress,
    isPressable = true,
}: TokenCardWithdrawProps) => {
    const { handle } = useBalance()
    const withdrawFormik = useWithdrawFormik()

    const network = useAppSelector((state) => state.base.network)

    const { data, isLoading } = useSWR(
        ["withdraw-balance", token.address, network, chainId],
        async () => {
            const { amount } = await handle({
                chainId,
                network,
                address: "0xA7C1d79C7848c019bCb669f1649459bE9d076DA3",
                tokenAddress: token.address,
                decimals: token.decimals,
            })
            return roundNumber(amount, 4)
        },
    )

    return (
        <NomasCard
            isPressable={isPressable}
            className={`flex items-center ${
                withdrawFormik.values.tokenId === token.tokenId
                    ? "bg-content3-100 border-1 border-content3-300"
                    : "bg-content3-100"
            } `}
            onClick={onPress}
        >
            <NomasCardBody className="flex w-full flex-row items-center justify-between gap-2">
                {/* Left side: icon + name + short address */}
                <div className="flex items-center gap-3">
                    <NomasAvatar src={token.iconUrl} className="w-8 h-8" />
                    <div className="flex flex-col">
                        <span className="font-medium text-foreground-100">
                            {token.name}
                        </span>
                        <span className="text-xs text-foreground-500">
                            {shortenAddress(token.address ?? "0x0000")}
                        </span>
                    </div>
                </div>

                {/* Right: balance */}
                {isLoading ? (
                    <NomasSpinner />
                ) : (
                    <>
                        {/* Right side: balance + fiat */}
                        <div className="flex flex-col text-right">
                            <div className="flex justify-end items-baseline gap-1">
                                <span className="font-medium text-foreground-100">
                                    {data ?? "--"}
                                </span>
                                <span className="text-sm text-foreground-500">
                                    {token.symbol}
                                </span>
                            </div>
                            <span className="text-xs text-foreground-500">$0</span>
                        </div>
                    </>
                )}
            </NomasCardBody>
        </NomasCard>
    )
}
