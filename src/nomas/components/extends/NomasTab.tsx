import { twMerge } from "tailwind-merge"
import { Tabs, TabsList, TabsTrigger } from "../shadcn"
import type React from "react"
import type { WithClassName } from "@ciwallet-sdk/types"

export interface NomasTabTab {
    value: string
    label: string
    renderLabel?: (label: string) => React.ReactNode
}

export interface NomasTabProps extends WithClassName {
    value: string
    onValueChange: (value: string) => void
    tabs: Array<NomasTabTab>
}

export const NomasTab = ({ value, onValueChange, tabs, className }: NomasTabProps) => {
    return (
        <Tabs value={value} onValueChange={onValueChange} className={twMerge("p-2 w-full bg-card-dark border-border-cardradius-card-inner", className)}>
            <TabsList className="gap-2 flex w-full bg-transparent">
                {tabs.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value} 
                        className={twMerge(
                            "flex-1",
                            "text h-10 transition-all duration-200 ease-in-out px-4 cursor-pointer", 
                            value === tab.value && "bg-button rounded-button"
                        )}
                    >{tab.renderLabel ? tab.renderLabel(tab.label) : tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    )
}