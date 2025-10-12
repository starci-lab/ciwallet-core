import React from "react"
import { NomasCardBody, NomasCardHeader, NomasSpacer, NomasSpinner, NomasImage, TooltipTitle, NomasCardVariant, NomasCard } from "@/nomas/components"
import { HomeFunction, setHomeFunction, useAppDispatch, useAppSelector, selectTokenById, HomeAction, setHomeAction, selectSelectedAccount } from "@/nomas/redux"
import { DownloadSimpleIcon, PaperPlaneTiltIcon, ShoppingCartIcon, SwapIcon } from "@phosphor-icons/react"
import { useBalance } from "@ciwallet-sdk/hooks"
import useSWR from "swr"
import { chainManagerObj } from "@/nomas/obj"

export const TokenFunction = () => {
    const dispatch = useAppDispatch()
    const selectedTokenId = useAppSelector((state) => state.stateless.sections.home.selectedTokenId)
    const token = useAppSelector((state) => selectTokenById(state.persists, selectedTokenId))
    const action = useAppSelector((state) => state.stateless.sections.home.action)
    
    const actions = [
        {
            title: "Buy",
            action: HomeAction.Buy,
            icon: <ShoppingCartIcon weight="fill" className="w-8 h-8 min-w-8 min-h-8 text-muted" />,
            onPress: () => {
                dispatch(setHomeAction(HomeAction.Buy))
            },
            isActive: action === HomeAction.Buy,
            disabled: true,
        },
        {
            title: "Swap",
            action: HomeAction.Swap,
            icon: <SwapIcon weight="fill" className="w-8 h-8 min-w-8 min-h-8 text-muted" />,
            onPress: () => {
                dispatch(setHomeAction(HomeAction.Swap))
            },
            isActive: action === HomeAction.Swap,
            disabled: false,
        },
        {
            title: "Send",
            icon: <PaperPlaneTiltIcon weight="fill" className="w-8 h-8 min-w-8 min-h-8 text-muted" />,
            onPress: () => {
                dispatch(setHomeFunction(HomeFunction.Send))
            },
            isActive: action === HomeAction.Send,
            disabled: false,
        },
        {
            title: "Receive",
            icon: <DownloadSimpleIcon weight="fill" className="w-8 h-8 min-w-8 min-h-8 text-muted" />,
            onPress: () => {
                dispatch(setHomeFunction(HomeFunction.Receive))
            },
            isActive: action === HomeAction.Receive,
            disabled: false,
        },
    ]
    const chainId = useAppSelector((state) => state.persists.session.chainId)
    const network = useAppSelector((state) => state.persists.session.network)
    const account = useAppSelector((state) => selectSelectedAccount(state.persists))
    const rpcs = useAppSelector((state) => state.persists.session.rpcs)
    const { handle } = useBalance()
    const { data, isLoading } = useSWR(
        ["potfolio-balance", token.address, chainId, token.address],
        async () => {
            const { amount } = await handle({
                chainId,
                network,
                address: account?.accountAddress || "",
                tokenAddress: token.address,
                decimals: token.decimals,
                rpcs: rpcs[chainId][network],
            })
            return amount
        }
    )
    const chain = chainManagerObj.getChainById(chainId)
    return  <>
        <NomasCardHeader
            title="Token"
            showBackButton
            onBackButtonPress={() => {
                dispatch(setHomeFunction(HomeFunction.Portfolio))
            }}
        />
        <NomasCardBody>
            <div className="text-muted">{token.symbol}</div>
            <NomasSpacer y={2}/>
            <div className="text text-4xl">
                $0.0
            </div>
            <NomasSpacer y={6}/>
            <div className="grid grid-cols-4 gap-3">
                {actions.map((action) => {
                    return (
                        <NomasCard variant={NomasCardVariant.Button} key={action.action} onClick={action.onPress}>
                            <NomasCardBody className="p-4">
                                <div className="flex flex-col items-center justify-center">
                                    {action.icon}
                                    <NomasSpacer y={2}/>
                                    <div className="text-muted text-sm">{action.title}</div>
                                </div>
                            </NomasCardBody>
                        </NomasCard>
                    )
                })}
            </div>
            <NomasSpacer y={6}/>
            <TooltipTitle title="Holdings" size="sm"/>
            <NomasSpacer y={2}/>
            <NomasCard variant={NomasCardVariant.Dark} isInner>
                <NomasCardBody className="flex w-full flex-row items-center justify-between gap-2 p-4">
                    {/* Left: token info */}
                    <div className="flex flex-row items-center gap-2">
                        <div className="relative">
                            <NomasImage src={token.iconUrl} className="w-10 h-10 rounded-full" />
                            <NomasImage src={chain?.iconUrl} className="absolute bottom-0 right-0 z-50 w-5 h-5 rounded-full" />
                        </div>
                        <div className="flex flex-col">
                            <div className="text-sm text">{token.name}</div>
                            <div className="text-xs text-foreground-500 text-muted">{token.symbol}</div>
                        </div>
                    </div>
        
                    {/* Right: balance */}
                    {isLoading ? (
                        <NomasSpinner/>
                    ) : (
                        <div>
                            <div className="flex flex-col text-right"></div>
                            <div className="flex flex-col text-right">
                                <div className="text-sm text">{data ?? "--"}</div>
                                <div className="text-xs text-muted">$0</div>
                            </div>
                        </div>
                    )}
                </NomasCardBody>
            </NomasCard>
        </NomasCardBody>

    </>
}