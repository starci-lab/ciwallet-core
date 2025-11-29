import React, { useEffect } from "react"
import {
    NomasButton,
    NomasCard,
    NomasCardBody,
    NomasCardHeader,
    NomasLink,
    NomasSpinner,
} from "../../../extends"
import { CaretUpDown, IconButton, NomasNumberTransparentInput, PythIcon, TooltipTitle } from "../../../styled"
import { SelectToken } from "./SelectToken"
import {
    setExpandDetails,
    setSwapPage,
    useAppDispatch,
    useAppSelector,
} from "../../../../redux"
import { Action, Wallet } from "./Wallet"
import { ArrowDownIcon, ArrowsLeftRightIcon } from "@phosphor-icons/react"
import { SlippageConfig } from "./SlippageConfig"
import { RefreshIcon } from "./RefreshIcon"
import { NomasAggregation } from "./NomasAggregation"
import { useBalance } from "@ciwallet-sdk/hooks"
import useSWR from "swr"
import { roundNumber } from "@ciwallet-sdk/utils"
import { TIMEOUT_QUOTE } from "@ciwallet-sdk/constants"
import { useBatchAggregatorSwrMutations, useSwapFormik } from "@/nomas/hooks"
import { AutoRouter } from "./AutoRouter"
import type { AggregatorId } from "@ciwallet-sdk/classes"

export const SwapPage = () => {
    const protocolManager = useAppSelector((state) => state.protocol.manager)
    const tokenManager = useAppSelector((state) => state.token.manager)
    const chainManager = useAppSelector((state) => state.chain.manager)
    const expandDetails = useAppSelector((state) => state.swap.expandDetails)
    const dispatch = useAppDispatch()
    const swapFormik = useSwapFormik()
    const { handle } = useBalance()
    const network = useAppSelector((state) => state.base.network)
    const tokenInEntity = tokenManager.getTokenById(swapFormik.values.tokenIn)
    const tokenOutEntity = tokenManager.getTokenById(swapFormik.values.tokenOut)
    const tokenOutChainMetadata = chainManager.getChainById(
        swapFormik.values.tokenOutChainId
    )
    const { swrMutation } = useBatchAggregatorSwrMutations()

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

    useEffect(() => {
        const abortController = new AbortController()
        const debounceFn = setTimeout(async () => {
            swapFormik.setFieldValue("quoting", true)
            const batchQuote = await swrMutation.trigger({
                chainId: swapFormik.values.tokenInChainId,
                network,
                query: {
                    fromToken: tokenInEntity?.address || "",
                    toToken: tokenOutEntity?.address || "",
                    amount: Number(swapFormik.values.amountIn),
                    exactIn: true,
                    slippage: swapFormik.values.slippage,
                },
                signal: abortController.signal,
            })
            swapFormik.setFieldValue(
                "aggregations",
                Object.entries(batchQuote).map(([aggregator, quote]) => ({
                    aggregator: aggregator as AggregatorId,
                    amountOut: quote.amountOut,
                }))
            )
            const result = protocolManager.getBestQuote(batchQuote)
            if (!result) {
                console.error("No quote found")
                return
            }
            swapFormik.setFieldValue("amountOut", result.quote.amountOut)
            swapFormik.setFieldValue("bestAggregationId", result.aggregator)
            swapFormik.setFieldValue(
                "protocols",
                protocolManager.getProtocols(result.quote)
            )
            swapFormik.setFieldValue("quoting", false)
        }, TIMEOUT_QUOTE)
        return () => clearTimeout(debounceFn)
    }, [
        swapFormik.values.amountIn,
        swapFormik.values.tokenIn,
        network,
        swapFormik.values.tokenInChainId,
        swapFormik.values.refreshKey,
    ])

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
                    <NomasCard className="bg-content2-100 w-full">
                        <NomasCardBody>
                            <div className="flex items-center gap-2 justify-between">
                                <div className="text-xs">You Pay</div>
                                <Wallet
                                    isFocused={swapFormik.values.tokenInFocused}
                                    balance={swapFormik.values.balanceIn}
                                    onAction={(action: Action) => {
                                        if (action === Action.Max) {
                                            swapFormik.setFieldValue(
                                                "amountIn",
                                                roundNumber(maxBalanceIn).toString()
                                            )
                                        }
                                        if (action === Action.TwentyFivePercent) {
                                            swapFormik.setFieldValue(
                                                "amountIn",
                                                roundNumber(
                                                    Math.min(
                                                        swapFormik.values.balanceIn * 0.25,
                                                        maxBalanceIn
                                                    ),
                                                    5
                                                ).toString()
                                            )
                                        }
                                        if (action === Action.FiftyPercent) {
                                            swapFormik.setFieldValue(
                                                "amountIn",
                                                roundNumber(
                                                    Math.min(
                                                        swapFormik.values.balanceIn * 0.5,
                                                        maxBalanceIn
                                                    ),
                                                    5
                                                ).toString()
                                            )
                                        }
                                    }}
                                />
                            </div>
                            <Spacer y={1.5} />
                            <NomasCard className="bg-content2-200">
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
                        onPress={() => {
                            swapFormik.setFieldValue("tokenIn", swapFormik.values.tokenOut)
                            swapFormik.setFieldValue("tokenOut", swapFormik.values.tokenIn)
                            swapFormik.setFieldValue(
                                "tokenInChainId",
                                swapFormik.values.tokenOutChainId
                            )
                            swapFormik.setFieldValue(
                                "tokenOutChainId",
                                swapFormik.values.tokenInChainId
                            )
                            swapFormik.setFieldValue("amountIn", swapFormik.values.amountOut)
                        }}
                        className="z-50"
                    />
                    <NomasCard className="bg-content2-100 w-full">
                        <NomasCardBody>
                            <div className="flex items-center gap-2 justify-between">
                                <div className="text-xs">You Receive</div>
                                <Wallet disableFocus balance={swapFormik.values.balanceOut} />
                            </div>
                            <Spacer y={1.5} />
                            <NomasCard className="bg-content2-200">
                                <NomasCardBody className="flex-row flex justify-between items-center gap-">
                                    <SelectToken
                                        token={tokenManager.getTokenById(
                                            swapFormik.values.tokenOut
                                        )}
                                        chainMetadata={tokenOutChainMetadata}
                                        onSelect={() => {
                                            dispatch(setSwapPage(SwapPageState.SelectToken))
                                        }}
                                    />
                                    <div>
                                        {swapFormik.values.quoting ? (
                                            <div className="flex flex-col items-end">
                                                <div className="text-xl text-foreground-500">0.0</div>
                                                <NomasSpinner className="w-4 h-4 text-foreground-500" />
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="text-xl">
                                                    {swapFormik.values.amountOut}
                                                </div>
                                                <div className="text-xs text-right text-foreground-500">
                          $1500
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </NomasCardBody>
                            </NomasCard>
                            <Spacer y={4} />
                            <NomasButton
                                size="lg"
                                asBase
                                onPress={() => {
                                    swapFormik.submitForm()
                                }}
                                isDisabled={
                                    !swapFormik.isValid ||
                  swapFormik.isSubmitting ||
                  swapFormik.values.quoting
                                }
                            >
                                {(() => {
                                    if (!swapFormik.values.tokenIn) {
                                        return "Select Token In"
                                    }
                                    if (swapFormik.values.quoting) {
                                        return "Quoting"
                                    }
                                    if (swapFormik.isSubmitting) {
                                        return "Swapping"
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
                                    <AutoRouter />
                                </div>
                            </div>
                        </NomasCardBody>
                    </NomasCard>
                </div>
            </NomasCardBody>
        </>
    )
}
