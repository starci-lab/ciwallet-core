import { ArrowsLeftRightIcon, BankIcon, ImagesSquareIcon, TrendUpIcon, WalletIcon } from "@phosphor-icons/react"
import React from "react"
import { NomasCard } from "../../extends/NomasCard"
import { MenuItemButton } from "./MenuItemButton"

type MenuKey = "trade" | "perp" | "home" | "nfts" | "defi"

export interface MenuItem {
    key: MenuKey
    label: string
    icon: React.ReactNode
    disabled?: boolean
}

const items: MenuItem[] = [
    { key: "trade", label: "Trade", icon: <ArrowsLeftRightIcon size={18} />, disabled: true },
    { key: "perp", label: "Perp", icon: <TrendUpIcon size={18} />, disabled: true },
    { key: "home", label: "Home", icon: <WalletIcon size={18} /> },
    { key: "nfts", label: "NFTs", icon: <ImagesSquareIcon size={18} />, disabled: true },
    { key: "defi", label: "Defi", icon: <BankIcon size={18} />, disabled: true },
]

export const MainMenu = () => {
    const [active, setActive] = React.useState<MenuKey>("home")

    return (
        <NomasCard
            asCore
            radius="lg"
            //TODO: delete the mt-4 later
            className="mt-4 mx-6 p-2 flex flex-row items-center justify-center gap-2"
        >
            {items.map((item) => (
                <MenuItemButton
                    key={item.key}
                    item={item}
                    active={active === item.key}
                    onPress={() => setActive(item.key)}
                />
            ))}

        </NomasCard>
    )
}

