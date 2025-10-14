import { ArrowsLeftRightIcon, BankIcon, GameControllerIcon, TrendUpIcon, WalletIcon } from "@phosphor-icons/react"
import React from "react"
import { NomasCard, NomasCardVariant } from "../../../extends/NomasCard"
import { MenuItemButton } from "./MenuItemButton"
import { useAppSelector, HomeTab, setHomeTab, useAppDispatch } from "@/nomas/redux"
import { twMerge } from "tailwind-merge"

export interface MenuItem {
    key: HomeTab
    label: string
    icon: React.ReactNode
    disabled?: boolean
    isSelected?: boolean
}

export const MenuSection = () => {
    const homeTab = useAppSelector((state) => state.stateless.tabs.homeTab)
    const dispatch = useAppDispatch()
    const items: Array<MenuItem> = [
        { 
            key: HomeTab.Trade,
            label: "Trade",
            icon: <ArrowsLeftRightIcon weight={homeTab === HomeTab.Trade ? "fill" : "regular"} className={twMerge("w-8 h-8 text-muted-dark", homeTab === HomeTab.Trade && "text-muted")} />,
            disabled: true,
            isSelected: homeTab === HomeTab.Trade,
        },
        { 
            key: HomeTab.Perp,
            label: "Perp",
            icon: <TrendUpIcon weight={homeTab === HomeTab.Perp ? "fill" : "regular"} className={twMerge("w-8 h-8 text-muted-dark", homeTab === HomeTab.Perp && "text-muted")} />,
            disabled: true,
            isSelected: homeTab === HomeTab.Perp,
        },
        { 
            key: HomeTab.Home,
            label: "Home",
            icon: <WalletIcon weight={homeTab === HomeTab.Home ? "fill" : "regular"} className={twMerge("w-8 h-8 text-muted-dark", homeTab === HomeTab.Home && "text-muted")} />,
            isSelected: homeTab === HomeTab.Home,
        },
        { 
            key: HomeTab.Game,
            label: "Game",
            icon: <GameControllerIcon weight={homeTab === HomeTab.Game ? "fill" : "regular"} className={twMerge("w-8 h-8 text-muted-dark", homeTab === HomeTab.Game && "text-muted")} />,
            isSelected: homeTab === HomeTab.Game,
        },
        { 
            key: HomeTab.Defi,
            label: "Defi",
            icon: <BankIcon weight={homeTab === HomeTab.Defi ? "fill" : "regular"} className={twMerge("w-8 h-8 text-muted-dark", homeTab === HomeTab.Defi && "text-muted")} />,
            disabled: true,
            isSelected: homeTab === HomeTab.Defi,
        },
    ]
    return (
        <NomasCard
            variant={NomasCardVariant.Gradient}
            //TODO: delete the mt-4 later
            className="flex flex-row items-center justify-center gap-2 p-4"
        >
            {items.map((item) => (
                <MenuItemButton
                    key={item.key}
                    item={item}
                    active={item.isSelected ?? false}
                    isSelected={item.isSelected ?? false}
                    onClick={() => dispatch(setHomeTab(item.key))}
                />
            ))}

        </NomasCard>
    )
}

