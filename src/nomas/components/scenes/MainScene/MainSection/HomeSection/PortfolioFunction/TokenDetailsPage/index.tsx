import React, { useMemo } from "react"
import { NomasCard, NomasCardBody, NomasCardHeader, NomasCardVariant, NomasImage, NomasLink, NomasSpacer } from "../../../../../../extends"
import { DepositFunctionPage, HomeSelectorTab, PortfolioFunctionPage, SelectedTokenType, selectTokenById, selectTokens, setDepositFunctionPage, setDepositSelectedChainId, setDepositTokenId, setHomeSelectorTab, setPortfolioFunctionPage, setSelectedChainId, setVisible, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { chainManagerObj, tokenManagerObj } from "@/nomas/obj"
import { LineChart, PressableMotion, TooltipTitle } from "@/nomas/components"
import { ArrowsLeftRightIcon, DownloadSimpleIcon, EyeClosedIcon, EyeIcon, PaperPlaneRightIcon, ShoppingCartIcon } from "@phosphor-icons/react"
import { ChainDetails } from "./ChainDetails"
import { ChainSlider } from "./ChainSlider"
import { roundNumber } from "@ciwallet-sdk/utils"
import { TokenId } from "@ciwallet-sdk/types"

export const TokenDetailsPage = () => {
    const selectedTokenType = useAppSelector((state) => state.stateless.sections.home.selectedTokenType)
    const selectedTokenId = useAppSelector((state) => state.stateless.sections.home.selectedTokenId)
    const selectedUnifiedTokenId = useAppSelector((state) => state.stateless.sections.home.selectedUnifiedTokenId)
    const unifiedToken = tokenManagerObj.getUnifiedTokenById(selectedUnifiedTokenId)
    const token = useAppSelector((state) => selectTokenById(state.persists, selectedTokenId))
    const tokenItems = useAppSelector((state) => state.stateless.sections.home.tokenItems)
    const dispatch = useAppDispatch()
    const name = selectedTokenType === SelectedTokenType.Token ? token?.name : unifiedToken?.name
    const visible = useAppSelector((state) => state.stateless.sections.home.visible)
    const tokens = useAppSelector((state) => state.persists.session.tokens)
    const prices = useAppSelector((state) => state.stateless.dynamic.prices)
    const unifiedPrices = useAppSelector((state) => state.stateless.dynamic.unifiedPrices)
    const price = selectedTokenType === SelectedTokenType.Token ? prices[selectedTokenId] : unifiedPrices[selectedUnifiedTokenId]
    const balances = useAppSelector((state) => state.stateless.dynamic.balances)
    const selectedChainId = useAppSelector((state) => state.stateless.sections.home.selectedChainId)
    const tokenArray = useAppSelector((state) => selectTokens(state.persists))
    const tokenIds = [
        ...new Set(tokenArray.filter((token) => {
            if (selectedTokenType === SelectedTokenType.Token) {
                return token.tokenId === selectedTokenId
            } else {
                return token.unifiedTokenId === selectedUnifiedTokenId
            }
        })
            .filter((token) => {
                if (selectedChainId === "overview" || selectedTokenType === SelectedTokenType.Token) {
                    return true
                } else {
                    return token.chainId === selectedChainId
                }
            })
            .map((token) => token.tokenId))
    ]
    const totalBalance = tokenIds.reduce((acc, tokenId) => acc + (balances[tokenId] ?? 0), 0)
    const depositTokenId = useMemo(() => {
        if (selectedTokenType === SelectedTokenType.Token) {
            return selectedTokenId
        }
        return tokenItems.find((tokenItem) => tokenItem.chainId === selectedChainId)?.tokenId
    }, [selectedTokenType, tokenItems, selectedChainId])
    const actions = [
        {
            icon: <PaperPlaneRightIcon className="w-6 h-6 min-w-6 min-h-6" />,
            title: "Transfer",
            onPress: () => {
                console.log("transfer")
            }
        },
        {
            icon: <DownloadSimpleIcon className="w-6 h-6 min-w-6 min-h-6" />,
            title: "Receive",
            onPress: () => {
                if (selectedChainId === "overview") {
                    throw new Error("All networks not supported")
                }
                dispatch(setHomeSelectorTab(HomeSelectorTab.Deposit))
                dispatch(setDepositFunctionPage(DepositFunctionPage.Deposit))
                dispatch(setDepositTokenId(depositTokenId ?? TokenId.MonadTestnetMon))
                dispatch(setDepositSelectedChainId(selectedChainId))
            }
        },
        {
            icon: <ArrowsLeftRightIcon className="w-6 h-6 min-w-6 min-h-6" />,
            title: "Swap",
            onPress: () => {
                console.log("swap")
            }
        },
        {
            icon: <ShoppingCartIcon className="w-6 h-6 min-w-6 min-h-6" />,
            title: "Buy",
            onPress: () => {
                console.log("buy")
            }
        }
    ]
    return (
        <>
            <NomasCardHeader
                startIcon={<NomasImage src={selectedTokenType === SelectedTokenType.Token ? token?.iconUrl : unifiedToken?.iconUrl} className="w-6 h-6 rounded-full" />}
                title={name}
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setSelectedChainId("overview"))
                    dispatch(setPortfolioFunctionPage(PortfolioFunctionPage.Portfolio))
                }}
            />
            <NomasCardBody>
                <div>
                    {
                        selectedTokenType === SelectedTokenType.UnifiedToken && (
                            <>
                                <ChainSlider />
                                <NomasSpacer y={6}/>
                            </>
                        )
                    }
                    <div className="flex items-center gap-2">
                        <TooltipTitle title="Balance" size="xs"/>
                        {
                            visible ? (
                                <NomasLink onClick={() => dispatch(setVisible(false))}>
                                    <EyeIcon className="w-4 h-4" />
                                </NomasLink>
                            ) : (
                                <NomasLink onClick={() => dispatch(setVisible(true))}>
                                    <EyeClosedIcon className="w-4 h-4" />
                                </NomasLink>
                            )
                        }
                    </div>
                    <NomasSpacer y={2}/>
                    <div className="text-4xl font-bold">
                        {
                            visible ? totalBalance : "******"
                        }
                    </div>
                    <NomasSpacer y={2}/>
                    <div className="flex items-center gap-2">
                        <div className="text-xs">{
                            visible ? `$${price ?? 0}` : "******"
                        }</div>
                        <div className="text-muted text-xs">{
                            visible ? `$${roundNumber(totalBalance * (price ?? 0), 5)}` : "******"
                        }</div>
                    </div>
                </div>
                {
                    selectedTokenType === SelectedTokenType.UnifiedToken && selectedChainId === "overview" && (
                        <>
                            <NomasSpacer y={6}/>
                            <NomasCard variant={NomasCardVariant.Dark} isInner>
                                <div className="flex items-center justify-between p-4 pb-2">
                                    <TooltipTitle title="Allocation" size="sm"/>
                                </div>
                                <NomasCardBody className="p-4 flex flex-col gap-4" scrollHeight={200} scrollable> 
                                    {   
                                        tokenItems.map((tokenItem) => {
                                            const token = tokens[tokenItem.chainId]?.[tokenItem.network].find((t) => t.tokenId === tokenItem.tokenId)
                                            if (!token) return null
                                            const chain = chainManagerObj.getChainById(tokenItem.chainId)
                                            if (!chain) return null
                                            return <ChainDetails 
                                                key={tokenItem.tokenId} 
                                                chain={chain}
                                                tokenId={tokenItem.tokenId}
                                            />
                                        })
                                    }
                                </NomasCardBody>
                            </NomasCard>
                        </>
                    )}
                {
                    (selectedTokenType === SelectedTokenType.Token || selectedChainId !== "overview") && (
                        <>
                            <NomasSpacer y={6}/>
                            <NomasCard variant={NomasCardVariant.Dark} isInner>
                                <NomasCardBody className="p-0">
                                    <div className="grid grid-cols-4 gap-4">
                                        {actions.map((action) => {
                                            return (
                                                <PressableMotion key={action.title} onClick={action.onPress}>
                                                    <div className="flex flex-col items-center justify-center h-fit !p-4 shadow-nonetext-text-muted cursor-pointer">
                                                        {action.icon}
                                                        <div className="text-muted text-sm">{action.title}</div>
                                                    </div>
                                                </PressableMotion>
                                            )
                                        })}
                                    </div>
                                </NomasCardBody>
                            </NomasCard>
                        </>
                    )
                }
                <NomasSpacer y={6}/>
                <LineChart />
            </NomasCardBody>
        </>
    )
}