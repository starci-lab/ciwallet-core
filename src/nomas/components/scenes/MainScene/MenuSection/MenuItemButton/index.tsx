import React from "react"
import type { MenuItem } from "../index"
import { twMerge } from "tailwind-merge"

export interface MenuItemButtonProps {
    item: MenuItem
    active: boolean
    onClick: () => void
    isSelected: boolean
}

export const MenuItemButton = ({ item, isSelected, onClick }: MenuItemButtonProps) => {
    return (
        <div onClick={onClick} 
            className={
                twMerge(
                    "aspect-square w-20 rounded-full grid place-items-center cursor-pointer transition-colors duration-200", 
                    isSelected && "bg-card-gradient border-card"
                )
            }>
            <div className="flex flex-col p-2 items-center gap-1 justify-center">
                {item.icon}
                <div className={
                    twMerge("text-sm text-text-muted-dark", 
                        isSelected && "text-muted"
                    )}>{item.label}</div>
            </div>
        </div>
    )
}