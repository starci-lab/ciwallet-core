import React from "react"
import {
    CaretUpDown,
    IconButton,
    NomasButton,
    NomasCard,
    NomasCardBody,
    NomasCardHeader,
    NomasLink,
    NomasNumberTransparentInput,
    PythIcon,
    TooltipTitle,
} from "../../components"
import { cn, Spacer } from "@heroui/react"
import { SelectToken } from "./SelectToken"
import {
    setExpandDetails,
    setSwapPage,
    SwapPageState,
    useAppDispatch,
    useAppSelector,
} from "../../redux"
import { Action, Wallet } from "./Wallet"
import { ArrowDownIcon, ArrowsLeftRightIcon } from "@phosphor-icons/react"
import { SlippageConfig } from "./SlippageConfig"
import { RefreshIcon } from "./RefreshIcon"
import { NomasAggregation } from "./NomasAggregation"
import { useSwapFormik } from "@/nomas/hooks"
import { useBalance } from "@ciwallet-sdk/hooks"
import useSWR from "swr"
import { roundNumber } from "@ciwallet-sdk/utils"

export const SwapPage = () => {
    const tokenManager = useAppSelector((state) => state.token.manager)
    const chainManager = useAppSelector((state) => state.chain.manager)
    const expandDetails = useAppSelector((state) => state.swap.expandDetails)
    const dispatch = useAppDispatch()
    const swapFormik = useSwapFormik()
    const { handle } = useBalance()
    const network = useAppSelector((state) => state.base.network)
    const tokenInEntity = tokenManager.getTokenById(swapFormik.values.tokenIn)
    const tokenOutEntity = tokenManager.getTokenById(swapFormik.values.tokenOut)
    const tokenOutChainMetadata = chainManager.getChainById(swapFormik.values.tokenInChainId)

    useSWR(
        [
            "TOKEN_IN_BALANCE",
            network,
            swapFormik.values.tokenInChainId,
            swapFormik.values.tokenIn,
        ],
        async () => {
            const { amount } = await handle({
                network,
                tokenAddress: tokenInEntity?.address,
                address: "0xA7C1d79C7848c019bCb669f1649459bE9d076DA3",
                chainId: swapFormik.values.tokenInChainId,
                decimals: tokenInEntity?.decimals,
            })
            swapFormik.setFieldValue("balanceIn", amount)
        }
    )

    useSWR(
        [
            "TOKEN_OUT_BALANCE",
            network,
            swapFormik.values.tokenOutChainId,
            swapFormik.values.tokenOut,
        ],
        async () => {
            const { amount } = await handle({
                network,
                tokenAddress: tokenOutEntity?.address,
                address: "0xA7C1d79C7848c019bCb669f1649459bE9d076DA3",
                chainId: swapFormik.values.tokenOutChainId,
                decimals: tokenOutEntity?.decimals,
            })
            swapFormik.setFieldValue("balanceOut", amount)
        }
    )

    const maxBalanceIn = swapFormik.values.balanceIn - 0.01

    return (
        <>
            <NomasCardHeader
                title="Swap"
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setSwapPage(SwapPageState.SelectToken))
                }}
            />
            <NomasCardBody>
                <div className="flex justify-between items-center">
                    <NomasAggregation />
                    <div className="flex items-center gap-2">
                        <SlippageConfig />
                        <RefreshIcon />
                    </div>
                </div>
                <Spacer y={4} />
                <div className="items-center -space-y-2 flex flex-col">
                    <NomasCard className="bg-content3 w-full">
                        <NomasCardBody>
                            <div className="flex items-center gap-2 justify-between">
                                <div className="text-xs">You Pay</div>
                                <Wallet
                                    isFocused={swapFormik.values.tokenInFocused}
                                    balance={swapFormik.values.balanceIn}
                                    onAction={(action: Action) => {
                                        if (action === Action.Max) {
                                            swapFormik.setFieldValue("amountIn", roundNumber(maxBalanceIn).toString())
                                        }
                                        if (action === Action.TwentyFivePercent) {
                                            swapFormik.setFieldValue("amountIn", roundNumber(Math.min(swapFormik.values.balanceIn * 0.25, maxBalanceIn), 5).toString())
                                        }
                                        if (action === Action.FiftyPercent) {
                                            swapFormik.setFieldValue("amountIn", roundNumber(Math.min(swapFormik.values.balanceIn * 0.5, maxBalanceIn), 5).toString())
                                        }
                                    }}
                                />
                            </div>
                            <Spacer y={1.5} />
                            <NomasCard className="bg-content2">
                                <NomasCardBody className="flex-row flex justify-between items-center gap-">
                                    <SelectToken
                                        token={tokenInEntity}
                                        chainMetadata={tokenOutChainMetadata}
                                        onSelect={() => {
                                            dispatch(setSwapPage(SwapPageState.SelectToken))
                                        }}
                                    />
                                    <div>
                                        <NomasNumberTransparentInput
                                            value={swapFormik.values.amountIn}
                                            onValueChange={(value) => {
                                                swapFormik.setFieldValue("amountIn", value)
                                            }}
                                            onFocus={() => {
                                                swapFormik.setFieldValue("tokenInFocused", true)
                                            }}
                                            isRequired
                                            onBlur={() => {
                                                swapFormik.setFieldValue("tokenInFocused", false)
                                                swapFormik.setFieldTouched("amountIn")
                                            }}
                                            isInvalid={
                                                !!(
                                                    swapFormik.touched.amountIn &&
                          swapFormik.errors.amountIn
                                                )
                                            }
                                        />
                                        <div className="text-xs text-right   text-foreground-500">
                      $1500
                                        </div>
                                    </div>
                                </NomasCardBody>
                            </NomasCard>
                        </NomasCardBody>
                    </NomasCard>
                    <IconButton
                        icon={<ArrowDownIcon />}
                        onPress={() => {}}
                        className="z-50"
                    />
                    <NomasCard className="bg-content3 w-full">
                        <NomasCardBody>
                            <div className="flex items-center gap-2 justify-between">
                                <div className="text-xs">You Receive</div>
                                <Wallet
                                    disableFocus
                                    balance={swapFormik.values.balanceOut}
                                />
                            </div>
                            <Spacer y={1.5} />
                            <NomasCard className="bg-content2">
                                <NomasCardBody className="flex-row flex justify-between items-center gap-">
                                    <SelectToken
                                        token={tokenManager.getTokenById(swapFormik.values.tokenOut)}
                                        chainMetadata={tokenOutChainMetadata}
                                        onSelect={() => {
                                            dispatch(setSwapPage(SwapPageState.SelectToken))
                                        }}
                                    />
                                    <div>
                                        <div className="text-xl">555</div>
                                        <div className="text-xs text-right text-foreground-500">
                      $1500
                                        </div>
                                    </div>
                                </NomasCardBody>
                            </NomasCard>
                            <Spacer y={4} />
                            <NomasButton
                                size="lg"
                                asBase
                                isDisabled={!swapFormik.isValid || swapFormik.isSubmitting}
                            >
                                {(() => {
                                    if (swapFormik.isSubmitting) {
                                        return "Swapping..."
                                    }
                                    if (swapFormik.errors.amountIn) {
                                        return `Insufficient ${tokenInEntity?.symbol} Balance`
                                    }
                                    return "Swap"
                                })()}
                            </NomasButton>
                            <Spacer y={2} />
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1">
                                    <div className="text-xs">1 MON</div>
                                    <NomasLink asButton>
                                        <ArrowsLeftRightIcon className="w-4 h-4" />
                                    </NomasLink>
                                    <div className="text-xs">1 CAKE</div>
                                </div>
                                <div className="text-xs">
                                    <div className="flex items-center gap-1 text-foreground-500">
                                        <div className="flex items-center gap-1">
                                            <div>Fee</div>
                                            <div>0.005 BNB</div>
                                        </div>
                                        <CaretUpDown
                                            className="text-foreground-500"
                                            isUp={expandDetails}
                                            setIsUp={() => {
                                                dispatch(setExpandDetails(!expandDetails))
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div
                                className={cn(
                                    "overflow-hidden transition-all duration-300",
                                    expandDetails ? "max-h-[500px]" : "max-h-0"
                                )}
                            >
                                <Spacer y={4} />
                                <div className="flex justify-between">
                                    <TooltipTitle
                                        title="Price Difference"
                                        tooltip="The difference between the market price and estimated price due to trade size."
                                        size="xs"
                                    />
                                    <div className="flex items-center gap-1">
                                        <div className="text-success text-xs">10% better than</div>
                                        <PythIcon className="w-4 h-4" />
                                    </div>
                                </div>
                                <Spacer y={2} />
                                <div className="flex justify-between">
                                    <TooltipTitle
                                        title="Minimum Received"
                                        size="xs"
                                        tooltip="The guaranteed minimum amount of tokens you will receive after the trade."
                                    />
                                    <div className="text-xs">100 USDC</div>
                                </div>
                                <Spacer y={2} />
                                <div className="flex justify-between">
                                    <TooltipTitle
                                        title="Auto Router"
                                        size="xs"
                                        tooltip="Auto route will automatically select the best route for the trade."
                                    />
                                    <div className="text-xs">100 USDC</div>
                                </div>
                            </div>
                        </NomasCardBody>
                    </NomasCard>
                </div>
            </NomasCardBody>
        </>
    )
}
