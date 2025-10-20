import React, { useEffect } from "react"
import {
    NomasButton,
    NomasButtonIcon,
    NomasCard,
    NomasCardBody,
    NomasCardHeader,
    NomasLink,
    NomasSpacer,
    NomasSpinner,
} from "../../../../../extends"
import { 
    CaretUpDown, 
    NomasNumberTransparentInput, 
    PythIcon, 
    TooltipTitle 
} from "../../../../../styled"
import { SelectToken } from "./SelectToken"
import { Action, Wallet } from "./Wallet"
import { ArrowsLeftRightIcon } from "@phosphor-icons/react"
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
import { selectSelectedAccount, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { chainManagerObj, protocolManagerObj, tokenManagerObj } from "@/nomas/obj"
import { setSwapFunctionPage } from "@/nomas/redux/slices/stateless/sections/swap"
import { SwapFunctionPage } from "@/nomas/redux/slices/stateless/sections/swap"
import { twMerge } from "tailwind-merge"

export const SwapFunction = () => {
    const expandDetails = useAppSelector((state) => state.stateless.sections.swap.expandDetails)
    const dispatch = useAppDispatch()
    const swapFormik = useSwapFormik()
    const { handle } = useBalance()
    const network = useAppSelector((state) => state.persists.session.network)
    const rpcs = useAppSelector((state) => state.persists.session.rpcs)
    const { swrMutation } = useBatchAggregatorSwrMutations()
    const selectedAccount = useAppSelector((state) => selectSelectedAccount(state.persists))
    const tokens = useAppSelector((state) => state.persists.session.tokens)
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
                tokenAddress: swapFormik.values.tokenIn,
                address: selectedAccount?.accountAddress ?? "",
                chainId: swapFormik.values.tokenInChainId,
                decimals: 9,
                rpcs: rpcs[swapFormik.values.tokenInChainId][network],
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
                tokenAddress: swapFormik.values.tokenOut,
                address: selectedAccount?.accountAddress ?? "",
                chainId: swapFormik.values.tokenOutChainId,
                decimals: 9,
                rpcs: rpcs[swapFormik.values.tokenOutChainId][network],
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
                    fromToken: tokenManagerObj.getTokenById(swapFormik.values.tokenIn)?.address ?? "",
                    toToken: tokenManagerObj.getTokenById(swapFormik.values.tokenOut)?.address ?? "",
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
            const result = protocolManagerObj.getBestQuote(batchQuote)
            if (!result) {
                console.error("No quote found")
                return
            }
            swapFormik.setFieldValue("amountOut", result.quote.amountOut)
            swapFormik.setFieldValue("bestAggregationId", result.aggregator)
            swapFormik.setFieldValue(
                "protocols",
                protocolManagerObj.getProtocols(result.quote)
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
                    dispatch(setSwapFunctionPage(SwapFunctionPage.SelectToken))
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
                <NomasSpacer y={4} />
                <div className="items-center -space-y-2 flex flex-col">
                    <div className="bg-card-1 radius-card-inner w-full p-4">
                        <div className="flex items-center justify-between">
                            <div className="text-xs text">You Pay</div>
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
                        <NomasSpacer y={1.5} />
                        <div className="bg-card-2 radius-card-inner p-4">
                            <div className="flex justify-between items-center">
                                <SelectToken
                                    token={tokens[swapFormik.values.tokenInChainId][network]?.find((token) => token.tokenId === swapFormik.values.tokenIn)}
                                    chainMetadata={chainManagerObj.getChainById(swapFormik.values.tokenInChainId)}
                                    onSelect={() => {
                                        dispatch(setSwapFunctionPage(SwapFunctionPage.SelectToken))
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
                                    <div className="text-xs text-right text-muted text-foreground-500">
                      $1500
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <NomasButtonIcon
                        className="z-20"
                        onClick={() => {
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
                    >
                        <ArrowsLeftRightIcon className="w-5 h-5 min-w-5 min-h-5" />
                    </NomasButtonIcon>
                    <div className="bg-card-1 radius-card-inner w-full p-4">
                        <div className="flex items-center justify-between">
                            <div className="text-xs text">You Receive</div>
                            <Wallet disableFocus balance={swapFormik.values.balanceOut} />
                        </div>
                        <NomasSpacer y={1.5} />
                        <div className="bg-card-2 radius-card-inner p-4">
                            <div className="flex justify-between items-center">
                                <SelectToken
                                    token={tokens[swapFormik.values.tokenOutChainId][network]?.find((token) => token.tokenId === swapFormik.values.tokenOut)}
                                    onSelect={() => {
                                        dispatch(setSwapFunctionPage(SwapFunctionPage.SelectToken))
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
                            </div>
                        </div>
                        <NomasSpacer y={4} />
                        <NomasButton
                            xlSize
                            className="w-full"
                            onClick={() => {
                                swapFormik.submitForm()
                            }}
                            isDisabled={
                                !swapFormik.isValid ||
                  swapFormik.isSubmitting ||
                  swapFormik.values.quoting
                            }
                        >
                            {(() => {
                                if (swapFormik.values.quoting) {
                                    return "Quoting..."
                                }
                                if (swapFormik.isSubmitting) {
                                    return "Swapping..."
                                }
                                if (swapFormik.errors.amountIn) {
                                    return `Insufficient ${tokenManagerObj.getTokenById(swapFormik.values.tokenIn)?.symbol ?? ""} Balance`
                                }
                                return "Swap"
                            })()}
                        </NomasButton>
                        <NomasSpacer y={2} />
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1">
                                <div className="text-xs">1 MON</div>
                                <NomasLink onClick={() => {
                                    dispatch(setSwapFunctionPage(SwapFunctionPage.Swap))
                                }}>
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
                                            // TODO: Implement expand details
                                            console.log("expand details")
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            className={twMerge(
                                "overflow-hidden transition-all duration-300",
                                expandDetails ? "max-h-[500px]" : "max-h-0"
                            )}
                        >
                            <NomasSpacer y={4} />
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
                            <NomasSpacer y={2} />
                            <div className="flex justify-between">
                                <TooltipTitle
                                    title="Minimum Received"
                                    size="xs"
                                    tooltip="The guaranteed minimum amount of tokens you will receive after the trade."
                                />
                                <div className="text-xs">100 USDC</div>
                            </div>
                            <NomasSpacer y={2} />
                            <div className="flex justify-between">
                                <TooltipTitle
                                    title="Auto Router"
                                    size="xs"
                                    tooltip="Auto route will automatically select the best route for the trade."
                                />
                                <AutoRouter />
                            </div>
                        </div>
                    </div>
                </div>
            </NomasCardBody>

        </> 
    )
}
