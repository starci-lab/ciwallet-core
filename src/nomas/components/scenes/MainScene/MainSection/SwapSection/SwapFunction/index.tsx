import React, { useEffect, useMemo } from "react"
import {
    NomasButton,
    NomasButtonIcon,
    NomasCardBody,
    NomasCardHeader,
    NomasImage,
    NomasLink,
    NomasSpacer,
    NomasSpinner,
} from "../../../../../extends"
import {
    Action,
    ExpandToggle, 
    NomasNumberTransparentInput, 
    PythIcon, 
    TooltipTitle, 
    Wallet
} from "../../../../../styled"
import { SelectToken } from "./SelectToken"
import { ArrowsLeftRightIcon } from "@phosphor-icons/react"
import { SlippageConfig } from "./SlippageConfig"
import { NomasAggregation } from "./NomasAggregation"
import { roundNumber, slippageAdjustment } from "@ciwallet-sdk/utils"
import { useSwapFormik } from "@/nomas/hooks"
import { AutoRouter } from "./AutoRouter"
import { selectTokensByChainIdAndNetwork, setExpandDetails, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { aggregatorManagerObj, chainManagerObj, tokenManagerObj } from "@/nomas/obj"
import { SwapFunctionPage, setSwapFunctionPage } from "@/nomas/redux"
import { twMerge } from "tailwind-merge"
import { AnimatePresence, motion } from "framer-motion"
import { RefreshProgressRing } from "./RefreshProgressRing"

export const SwapFunction = () => {
    const expandDetails = useAppSelector((state) => state.stateless.sections.swap.expandDetails)
    const dispatch = useAppDispatch()
    const swapFormik = useSwapFormik()
    const network = useAppSelector((state) => state.persists.session.network)
    const tokensIn = useAppSelector((state) => selectTokensByChainIdAndNetwork(state.persists, swapFormik.values.tokenInChainId, network))
    const tokensOut = useAppSelector((state) => selectTokensByChainIdAndNetwork(state.persists, swapFormik.values.tokenOutChainId, network))
    const prices = useAppSelector((state) => state.stateless.dynamic.prices)
    const maxBalanceIn = swapFormik.values.balanceIn - 0.01
    const balances = useAppSelector((state) => state.stateless.dynamic.balances)
    const slippage = swapFormik.values.slippage
    useEffect(() => {
        swapFormik.setFieldValue("balanceIn", balances[swapFormik.values.tokenIn] ?? 0)
    }, [balances])

    useEffect(() => {
        swapFormik.setFieldValue("balanceOut", balances[swapFormik.values.tokenOut] ?? 0)
    }, [prices])

    const tokenOutPrice = useMemo(() => prices[swapFormik.values.tokenOut] ?? 0, [prices])
    const tokenInPrice = useMemo(() => prices[swapFormik.values.tokenIn] ?? 0, [prices])

    const expectedPythPrice = useMemo(() => {
        if (tokenInPrice === 0 || tokenOutPrice === 0) return 0
        return roundNumber(tokenOutPrice / tokenInPrice)
    }, [tokenOutPrice, tokenInPrice])

    const bestAggregation = useMemo(() => {
        return aggregatorManagerObj.getAggregatorById(swapFormik.values.bestAggregationId)
    }, [swapFormik.values.bestAggregationId])
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
                        <RefreshProgressRing />
                    </div>
                </div>
                <NomasSpacer y={4} />
                <div className="items-center -space-y-2 flex flex-col">
                    <div className="bg-card-dark radius-card-inner w-full p-4">
                        <div className="flex items-center justify-between">
                            <div className="text-xs text">You Pay</div>
                            <Wallet
                                isFocused={swapFormik.values.tokenInFocused}
                                balance={swapFormik.values.balanceIn}
                                onAction={
                                    (action: Action) => {
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
                        <div className="bg-card-dark-2 radius-card-inner p-2 pr-4">
                            <div className="flex justify-between items-center">
                                <SelectToken
                                    token={tokensIn.find((token) => token.tokenId === swapFormik.values.tokenIn)}
                                    chainMetadata={chainManagerObj.getChainById(swapFormik.values.tokenInChainId)}
                                    onSelect={() => {
                                        swapFormik.setFieldValue("isTokenInClicked", true)
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
                      ${roundNumber((prices[swapFormik.values.tokenIn] ?? 0) * Number(swapFormik.values.amountIn))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <NomasButtonIcon
                        className="z-20 w-10 h-10"
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
                        <ArrowsLeftRightIcon className="w-5 h-5 min-w-5 min-h-5 text-muted" />
                    </NomasButtonIcon>
                    <div className="bg-card-dark radius-card-inner w-full p-4">
                        <div className="flex items-center justify-between">
                            <div className="text-xs text">You Receive</div>
                            <Wallet disableFocus balance={swapFormik.values.balanceOut} />
                        </div>
                        <NomasSpacer y={1.5} />
                        <div className="bg-card-dark-2 radius-card-inner p-2 pr-4">
                            <div className="flex justify-between items-center">
                                <SelectToken
                                    chainMetadata={chainManagerObj.getChainById(swapFormik.values.tokenOutChainId)}
                                    token={tokensOut.find((token) => token.tokenId === swapFormik.values.tokenOut)}
                                    onSelect={() => {
                                        swapFormik.setFieldValue("isTokenInClicked", false)
                                        dispatch(setSwapFunctionPage(SwapFunctionPage.SelectToken))
                                    }}
                                />
                                <div>
                                    {swapFormik.values.quoting ? (
                                        <div className="flex flex-col items-end">
                                            <div className="text-xl text-right">0.0</div>
                                            <NomasSpinner className="w-4 h-4 text-muted" />
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="text-xl text-right">
                                                {swapFormik.values.amountOut}
                                            </div>
                                            <div className="text-xs text-right text-muted">
                          ${roundNumber((prices[swapFormik.values.tokenOut] ?? 0) * Number(swapFormik.values.amountOut))}
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
                        <NomasSpacer y={4} />
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1">
                                <div className="text-xs">{swapFormik.values.amountIn} {tokenManagerObj.getTokenById(swapFormik.values.tokenIn)?.symbol ?? ""}</div>
                                <NomasLink onClick={() => {
                                    dispatch(setSwapFunctionPage(SwapFunctionPage.Swap))
                                }}>
                                    <ArrowsLeftRightIcon className="w-4 h-4" />
                                </NomasLink>
                                <div className="text-xs">{swapFormik.values.amountOut} {tokenManagerObj.getTokenById(swapFormik.values.tokenOut)?.symbol ?? ""}</div>
                            </div>
                            <div className="text-xs">
                                <div className="flex items-center gap-1 text-foreground-500">
                                    <ExpandToggle 
                                        isExpanded={expandDetails}
                                        setIsExpanded={() => {
                                            dispatch(setExpandDetails(!expandDetails))
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <AnimatePresence initial={false}>
                            {expandDetails && (
                                <motion.div
                                    key="details"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{
                                        duration: 0.25,
                                        ease: [0.25, 0.1, 0.25, 1], // cubic-bezier smooth ease
                                    }}
                                    className={twMerge(
                                        "overflow-hidden",
                                    )}
                                >
                                    <NomasSpacer y={6} />
                                    <div className="flex justify-between">
                                        <TooltipTitle
                                            title="Price Difference"
                                            tooltip="The difference between the market price and estimated price due to trade size."
                                            size="xs"
                                        />
                                        <div className="flex items-center gap-1">
                                            <div className={twMerge("text-xs", expectedPythPrice > 1 ? "text-success" : "text-danger")}>{expectedPythPrice > 1 ? `${roundNumber((expectedPythPrice - 1) * 100)}% better than` : `${roundNumber((1 - expectedPythPrice) * 100)}% worse than`}</div>
                                            <PythIcon className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <NomasSpacer y={4} />
                                    <div className="flex justify-between">
                                        <TooltipTitle
                                            title="Minimum Received"
                                            size="xs"
                                            tooltip="The guaranteed minimum amount of tokens you will receive after the trade."
                                        />
                                        <div className="text-xs">{slippageAdjustment(Number(swapFormik.values.amountOut), slippage)} {tokenManagerObj.getTokenById(swapFormik.values.tokenOut)?.symbol ?? ""}</div>
                                    </div>
                                    <NomasSpacer y={4} />
                                    <div className="flex justify-between">
                                        <TooltipTitle
                                            title="Aggregator"
                                            size="xs"
                                            tooltip="The aggregator that will be used to swap the tokens."
                                        />
                                        <div className="flex items-center gap-1">
                                            <NomasImage
                                                src={bestAggregation?.logo ?? ""}
                                                className="w-4 h-4 rounded-full"
                                            />
                                            <div className="text-xs">{bestAggregation?.name ?? ""}</div>
                                        </div>
                                    </div>
                                    <NomasSpacer y={4} />
                                    <div className="flex justify-between">
                                        <TooltipTitle
                                            title="Protocols"
                                            size="xs"
                                            tooltip="The protocols that will be used to swap the tokens."
                                        />
                                        <AutoRouter />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                </div>
            </NomasCardBody>

        </> 
    )
}
