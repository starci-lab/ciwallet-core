import React from "react"
import { NomasCard, NomasCardBody, NomasCardHeader, NomasCardVariant, NomasImage, NomasLink, NomasSpacer } from "../../../../../../extends"
import { PortfolioFunctionPage, SelectedTokenType, selectTokenById, setExpandTokenDetails, setPortfolioFunctionPage, setVisible, useAppDispatch, useAppSelector } from "@/nomas/redux"
import { chainManagerObj, tokenManagerObj } from "@/nomas/obj"
import { ExpandToggle, TooltipTitle } from "@/nomas/components"
import { EyeClosedIcon, EyeIcon } from "@phosphor-icons/react"
import { motion } from "framer-motion"
import { AnimatePresence } from "framer-motion"
import { ChainDetails } from "./ChainDetails"
import { ChainSlider } from "./ChainSlider"

export const TokenDetailsPage = () => {
    const selectedTokenType = useAppSelector((state) => state.persists.session.selectedTokenType)
    const selectedTokenId = useAppSelector((state) => state.persists.session.selectedTokenId)
    const selectedUnifiedTokenId = useAppSelector((state) => state.persists.session.selectedUnifiedTokenId)
    const unifiedToken = tokenManagerObj.getUnifiedTokenById(selectedUnifiedTokenId)
    const token = useAppSelector((state) => selectTokenById(state.persists, selectedTokenId))
    const tokenItems = useAppSelector((state) => state.stateless.sections.home.tokenItems)
    const dispatch = useAppDispatch()
    const name = selectedTokenType === SelectedTokenType.Token ? token?.name : unifiedToken?.name
    const visible = useAppSelector((state) => state.stateless.sections.home.visible)
    const expandTokenDetails = useAppSelector((state) => state.stateless.sections.home.expandTokenDetails)
    const tokens = useAppSelector((state) => state.persists.session.tokens)
    return (
        <>
            <NomasCardHeader
                startIcon={<NomasImage src={selectedTokenType === SelectedTokenType.Token ? token?.iconUrl : unifiedToken?.iconUrl} className="w-6 h-6" />}
                title={name}
                showBackButton
                onBackButtonPress={() => {
                    dispatch(setPortfolioFunctionPage(PortfolioFunctionPage.Portfolio))
                }}
            />
            <NomasCardBody>
                <div>
                    <ChainSlider />
                    <NomasSpacer y={6}/>
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
                            visible ? "0.0" : "******"
                        }
                    </div>
                    <NomasSpacer y={2}/>
                    <div className="flex items-center gap-2">
                        <div className="text-xs">{
                            visible ? "$1" : "******"
                        }</div>
                        <div className="text-muted text-xs">{
                            visible ? "$0.00" : "******"
                        }</div>
                    </div>
                </div>
                <NomasSpacer y={6}/>
                <NomasCard variant={NomasCardVariant.Dark} isInner>
                    <NomasCardBody className="p-4">
                        <div className="flex items-center justify-between">
                            <TooltipTitle title="Allocation" size="sm"/>
                            <ExpandToggle 
                                isExpanded={expandTokenDetails}
                                setIsExpanded={() => {
                                    dispatch(setExpandTokenDetails(!expandTokenDetails))
                                }}
                            />
                        </div>
                        {
                            <AnimatePresence initial={false}>
                                {expandTokenDetails && (
                                    <motion.div
                                        key="allocation-expand"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 22 }}
                                        className="overflow-hidden"
                                    >
                                        <NomasSpacer y={6} />
                                        {
                                            tokenItems.map((tokenItem) => {
                                                const token = tokens[tokenItem.chainId]?.[tokenItem.network].find((t) => t.tokenId === tokenItem.tokenId)
                                                if (!token) return null
                                                const chain = chainManagerObj.getChainById(tokenItem.chainId)
                                                if (!chain) return null
                                                return <ChainDetails key={tokenItem.tokenId} 
                                                    chain={chain}
                                                    accountAddress={tokenItem.accountAddress}
                                                    tokenAddress={token.address ?? ""}
                                                    decimals={token.decimals}
                                                />
                                            })
                                        }
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        }
                    </NomasCardBody>
                </NomasCard>
            </NomasCardBody>
        </>
    )
}