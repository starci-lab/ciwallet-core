import { ExpandToggle, NomasLink, NomasSpacer, Snippet, TokenIcons } from "@/nomas/components"
import { useAppSelector, type HDWallet, selectSelectedAccountByPlatform, setHdWalletsAccordionAccountId, useAppDispatch } from "@/nomas/redux"
import { PencilIcon, SlidersHorizontalIcon } from "@phosphor-icons/react"
import { AnimatePresence, motion } from "framer-motion"
import { Platform } from "@ciwallet-sdk/types"
import React, { useEffect, useState } from "react"
import { shortenAddress } from "@ciwallet-sdk/utils"

export interface HDWalletItemProps {
    hdWallet: HDWallet
    isDefaultExpanded: boolean
}

export const HDWalletItem = ({ hdWallet }: HDWalletItemProps) => {
    const hdWalletsAccordionAccountId = useAppSelector(state => state.stateless.sections.myWallets.hdWalletsAccordionAccountId)
    const [isExpanded, setIsExpanded] = useState(false)
    useEffect(() => {
        if (hdWalletsAccordionAccountId === hdWallet.id) {
            setIsExpanded(true)
        } else {
            setIsExpanded(false)
        }
    }, [hdWalletsAccordionAccountId])
    const evmAccount = useAppSelector(state => selectSelectedAccountByPlatform(state.persists, Platform.Evm))
    const solanaAccount = useAppSelector(state => selectSelectedAccountByPlatform(state.persists, Platform.Solana))
    const suiAccount = useAppSelector(state => selectSelectedAccountByPlatform(state.persists, Platform.Sui))
    const aptosAccount = useAppSelector(state => selectSelectedAccountByPlatform(state.persists, Platform.Aptos))
    const chains = [
        {
            platform: Platform.Evm,
            account: evmAccount,
            name: "EVM Network",
        },
        {
            platform: Platform.Solana,
            account: solanaAccount,
            name: "Solana Network",
        },
        {
            platform: Platform.Sui,
            account: suiAccount,
            name: "Sui Network",
        },
        {
            platform: Platform.Aptos,
            account: aptosAccount,
            name: "Aptos Network",
        },
    ]
    const dispatch = useAppDispatch()
    return (
        <div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="text-sm">{hdWallet.name}</div>
                    <ExpandToggle isExpanded={isExpanded} setIsExpanded={(
                        !isExpanded ? () => dispatch(setHdWalletsAccordionAccountId(hdWallet.id)) : () => dispatch(setHdWalletsAccordionAccountId(""))
                    )} />
                </div>
                <div className="flex items-center gap-2">
                    <NomasLink>
                        <PencilIcon />
                    </NomasLink>
                    <NomasLink>
                        <SlidersHorizontalIcon />
                    </NomasLink>
                </div>
            </div>
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        key="expand"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <NomasSpacer y={2} />
                        <div className="bg-card-2 radius-card-inner p-4 text-sm">
                            {
                                hdWallet.accounts.map((account) => (
                                    <div key={account.id} className="w-full">
                                        <div className="flex items-center gap-2 w-full justify-between">
                                            <div>{account.name}</div>
                                            <div className="flex items-center gap-2">
                                                <NomasLink>
                                                    <PencilIcon />
                                                </NomasLink>
                                                <NomasLink>
                                                    <SlidersHorizontalIcon />
                                                </NomasLink>
                                            </div>
                                        </div>
                                        <NomasSpacer y={4} />
                                        <div className="flex flex-col gap-4">
                                            {
                                                chains.map((chain) => (
                                                    <div key={chain.platform} className="flex items-center gap-2 justify-between">
                                                        <div>
                                                            <div className="text-sm">{chain.name}</div>
                                                            <NomasSpacer y={2} />
                                                            <TokenIcons platform={chain.platform} />
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="text-sm text-muted">
                                                                {
                                                                    shortenAddress(chain.account?.accountAddress ?? "")
                                                                }
                                                            </div>
                                                            <Snippet copyString={chain.account?.accountAddress ?? ""} />
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>         
                                    </div>
                                ))
                            }
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}