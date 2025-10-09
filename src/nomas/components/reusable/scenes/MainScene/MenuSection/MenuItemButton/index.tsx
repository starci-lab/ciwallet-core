import React from "react"
import { twMerge } from "tailwind-merge"
import { NomasButtonTextWithIcon } from "../../../../../extends/NomasButton"
import type { MenuItem } from "../index"

export interface MenuItemButtonProps {
    item: MenuItem
    active: boolean
    onPress: () => void
}

export const MenuItemButton = ({ item, active, onPress }: MenuItemButtonProps) => {
    return (
        <div className="flex flex-col items-center gap-1">
            <NomasButtonTextWithIcon
                icon={item.icon}
                iconPosition="start"
                isDisabled={item.disabled}
                onPress={onPress}
                className={twMerge(
                    "flex-col rounded-full gap-1 p-2 min-w-0 w-16 h-16 transition-all duration-200",
                    "justify-center items-center",
                    active 
                        ? "bg-foreground-700 opacity-70 scale-105" 
                        : "bg-foreground-800 opacity-20 hover:bg-foreground-600"
                )}
            >
                <div className={twMerge(
                    "text-xs font-medium transition-colors duration-200 mt-1",
                    active ? "text-white" : "text-foreground-100"
                )}>
                    {item.label}
                </div>
            </NomasButtonTextWithIcon>
        </div>
    )
}