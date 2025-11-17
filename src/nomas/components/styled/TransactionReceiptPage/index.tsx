import React from "react"
import { 
    NomasCardHeader, 
    NomasCardBody, 
    NomasCard, 
    NomasCardVariant,
    NomasButton,
    NomasImage,
    NomasSpacer,
    NomasDivider,
    NomasLink
} from "../../extends"
import { type TransactionData, TransactionType, useAppSelector, selectTokens } from "@/nomas/redux"
import { twMerge } from "tailwind-merge"
import { CheckIcon, XIcon, ArrowUpRightIcon } from "@phosphor-icons/react"
import { computePercentage, roundNumber, shortenAddress } from "@ciwallet-sdk/utils"
import { aggregatorManagerObj, chainManagerObj, explorerManagerObj } from "@/nomas/obj"
import { Snippet, TooltipTitle } from "../../styled"

export interface TransactionReceiptPageProps {
    showBackButton?: boolean
    onBackButtonPress?: () => void
    onProceedButtonClick?: () => void
    transactionData?: TransactionData
    success?: boolean
}

export interface TransactionDetails {
    title: React.ReactNode
    value: React.ReactNode
}
interface MapData {
    name: string
    successMessage: string
    errorMessage: string
    swapTokenSymbol?: string
    value: React.ReactNode
    details: Record<string, TransactionDetails>
    explorerUrl?: string
    explorerName?: string
}

export const TransactionReceiptPage = ({ 
    showBackButton, 
    onBackButtonPress, 
    onProceedButtonClick, 
    transactionData, 
    success,
}: TransactionReceiptPageProps) => {
    const tokens = useAppSelector((state) => selectTokens(state.persists))
    const explorers = useAppSelector((state) => state.persists.session.explorers)
    const config = (transactionData: TransactionData): MapData => {
        switch (transactionData.type) {
        case TransactionType.Swap: {
            const fromToken = tokens.find((token) => token.tokenId === transactionData.fromTokenId)
            const toToken = tokens.find((token) => token.tokenId === transactionData.toTokenId)
            if (!fromToken || !toToken) {
                throw new Error("Token not found")
            }
            const fromChainMetadata = chainManagerObj.getChainById(fromToken.chainId)
            const toChainMetadata = chainManagerObj.getChainById(toToken.chainId)
            if (!fromChainMetadata || !toChainMetadata) {
                throw new Error("Chain not found")
            }
            const aggregator = aggregatorManagerObj.getAggregatorById(transactionData.aggregatorId)
            if (!aggregator) {
                throw new Error("Aggregator not found")
            }
            const explorerId = explorers[toToken.chainId]
            if (!explorerId) {
                throw new Error("Explorer not found")
            }
            const explorerUrl = explorerManagerObj.getTransactionUrl(
                explorerId,
                transactionData.txHash,
                network
            )
            const explorerName = explorerManagerObj.getExplorerName(explorerId)
            return {
                name: "Swap",
                successMessage: `Swap from ${fromToken?.symbol} to ${toToken?.symbol} successfully`,
                errorMessage: `Swap from ${fromToken?.symbol} to ${toToken?.symbol} failed`,
                swapTokenSymbol: toToken?.symbol,
                value: <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <NomasImage src={toToken?.iconUrl} className="w-8 h-8 rounded-full" />
                            <NomasImage src={chainManagerObj.getChainById(toToken.chainId)?.iconUrl} className="absolute bottom-0 right-0 z-50 w-4 h-4 rounded-full" />
                        </div>
                        <div className="text-center text-2xl font-bold">
                        +{transactionData.amount} {toToken?.symbol}
                        </div>
                    </div>
                    <div className="text-centertext-text-muted text-sm">${roundNumber((prices[toToken.tokenId] ?? 0) *transactionData.amount)}</div>
                </div>,
                details: {
                    "pay": {
                        title: <TooltipTitle title="Pay" size="sm"/>,
                        value: <div className="flex gap-2 items-center">
                            <div className="relative">
                                <NomasImage src={fromToken?.iconUrl} className="w-5 h-5 rounded-full" />
                                <NomasImage src={chainManagerObj.getChainById(fromToken.chainId)?.iconUrl} className="absolute bottom-0 right-0 z-50 w-4 h-4 rounded-full" />
                            </div>
                            <div className="text-sm">
                                -{transactionData.amount} {fromToken?.symbol}
                            </div>
                        </div>
                    },
                    "chain": {
                        title: <TooltipTitle title="Chain" size="sm"/>,
                        value: <div className="flex gap-2 items-center">
                            <div className="relative flex items-center gap-2">
                                <NomasImage src={toChainMetadata.iconUrl} className="w-5 h-5 rounded-full" />
                                <span className="text-sm">{toChainMetadata.name}</span>
                            </div>
                        </div>
                    },
                    "provider": {
                        title: <TooltipTitle title="Provider" size="sm"/>,
                        value: <div className="flex items-center gap-2">
                            <NomasImage src={aggregator?.logo} className="w-5 h-5 rounded-full" />
                            <span className="text-sm">{aggregator?.name}</span>
                        </div>
                    },
                    "from": {
                        title: <TooltipTitle title="Sender" size="sm"/>,
                        value: <div className="flex items-center gap-2">
                            <div className="text-sm">{shortenAddress(transactionData.fromAddress)}</div>
                            <Snippet 
                                copyString={transactionData.fromAddress}
                            />
                        </div>
                    },
                    "recipient": {
                        title: <TooltipTitle title="Recipient" size="sm"/>,
                        value: <div className="flex items-center gap-2">
                            <div className="text-sm">{shortenAddress(transactionData.toAddress)}</div>
                            <Snippet copyString={transactionData.toAddress} />
                        </div>
                    }
                },
                explorerUrl,
                explorerName
            }
        }
        case TransactionType.Bridge: {
            const fromToken = tokens.find((token) => token.tokenId === transactionData.fromTokenId)
            const toToken = tokens.find((token) => token.tokenId === transactionData.toTokenId)
            if (!fromToken || !toToken) {
                throw new Error("Token not found")
            }
            return {
                name: "Bridge",
                successMessage: `Bridge from ${fromToken?.symbol} to ${toToken?.symbol} successfully`,
                errorMessage: `Bridge from ${fromToken?.symbol} to ${toToken?.symbol} failed`,
                value: <div className="flex flex-col gap-2">
                    <div className="text-center text-2xl font-bold">
                        +{transactionData.amount} {toToken?.symbol}
                    </div>
                    <div className="text-centertext-text-muted text-sm">${computePercentage(prices[toToken.tokenId] ?? 0, transactionData.amount)}</div>
                </div>,
                details: {},
                explorerUrl: "",
                explorerName: ""
            }
        }
        case TransactionType.Withdrawal: {
            const token = tokens.find((token) => token.tokenId === transactionData.tokenId)
            if (!token) {
                throw new Error("Token not found")
            }
            const explorerId = explorers[token.chainId]
            if (!explorerId) {
                throw new Error("Explorer not found")
            }
            const explorerUrl = explorerManagerObj.getTransactionUrl(
                explorerId,
                transactionData.txHash,
                network
            )
            const explorerName = explorerManagerObj.getExplorerName(explorerId)
            return {
                name: "Withdrawal",
                successMessage: `Withdraw ${token?.symbol} successfully`,
                errorMessage: `Withdraw ${token?.symbol} failed`,
                value: <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <NomasImage src={token?.iconUrl} className="w-8 h-8 rounded-full" />
                            <NomasImage src={chainManagerObj.getChainById(token.chainId)?.iconUrl} className="absolute bottom-0 right-0 z-50 w-4 h-4 rounded-full" />
                        </div>
                        <div className="text-center text-2xl font-bold">
                        -{transactionData.amount} {token?.symbol}
                        </div>
                    </div>
                    <div className="text-centertext-text-muted text-sm">${roundNumber((prices[token.tokenId] ?? 0) *transactionData.amount)}</div>
                </div>,
                details: {
                    "sender": {
                        title: <TooltipTitle title="Sender" size="sm"/>,
                        value: <div className="flex items-center gap-2">
                            <div className="text-sm">{shortenAddress(transactionData.fromAddress)}</div>
                            <Snippet 
                                copyString={transactionData.fromAddress}
                            />
                        </div>
                    },
                    "recipient": {
                        title: <TooltipTitle title="Recipient" size="sm"/>,
                        value: <div className="flex items-center gap-2">
                            <div className="text-sm">{shortenAddress(transactionData.toAddress)}</div>
                            <Snippet copyString={transactionData.toAddress} />
                        </div>
                    },
                    "chain": {
                        title: <TooltipTitle title="Chain" size="sm"/>,
                        value: <div className="flex items-center gap-2">
                            <NomasImage src={chainManagerObj.getChainById(token.chainId)?.iconUrl} className="w-5 h-5 rounded-full" />
                            <span className="text-sm">{chainManagerObj.getChainById(token.chainId)?.name}</span>
                        </div>
                    }
                },
                explorerUrl,
                explorerName
            }
        }
        }
    }
    const prices = useAppSelector((state) => state.stateless.dynamic.prices)
    if (!transactionData) {
        return null
    }
    const network = useAppSelector((state) => state.persists.session.network)
    const configData = config(transactionData)
    return (
        <>
            <NomasCardHeader
                title={configData.name}
                showBackButton={showBackButton}
                onBackButtonPress={onBackButtonPress}
            />
            <NomasCardBody>
                <NomasCard variant={NomasCardVariant.Dark} isInner className="p-4 grid place-items-center gap-4">
                    <div className={
                        twMerge(
                            "rounded-full bg-success w-12 h-12 grid place-items-center",
                            success ? "bg-success" : "bg-danger"
                        )}>
                        {
                            success ? <CheckIcon weight="bold" className="w-6 h-6"/> : <XIcon weight="bold" className="w-6 h-6"/>
                        }
                    </div>
                    <div className="text-center text-muted">{success ? configData.successMessage : configData.errorMessage}</div>
                    {success ? (
                        <>
                            {configData.value}
                            <NomasLink className="flex items-center gap-2" onClick={() => window.open(configData.explorerUrl, "_blank")}>
                                <div className="text-sm">View on {configData.explorerName}</div>
                                <ArrowUpRightIcon className="w-4 h-4" />
                            </NomasLink>
                            <NomasDivider />
                            <div className="flex flex-col gap-4 w-full">
                                {Object.entries(configData.details).map(([key, value]) => (
                                    <div key={key} className="flex justify-between items-center gap-4 w-full">
                                        {value.title}
                                        {value.value}
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <NomasLink className="flex items-center gap-2" onClick={() => window.open(configData.explorerUrl, "_blank")}>
                                <div className="text-sm">View on {configData.explorerName}</div>
                                <ArrowUpRightIcon className="w-4 h-4" />
                            </NomasLink>
                        </>
                    )}
                </NomasCard>
                <NomasSpacer y={6}/>
                <NomasButton
                    className="w-full"
                    onClick={onProceedButtonClick}
                    xlSize
                >
                        Proceed
                </NomasButton>
            </NomasCardBody>
        </>
    )
}

export default TransactionReceiptPage