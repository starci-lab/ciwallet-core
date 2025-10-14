import { twMerge } from "tailwind-merge"
import { Tabs, TabsList, TabsTrigger } from "../shadcn"

export interface NomasTabTab {
    value: string
    label: string
}

export interface NomasTabProps {
    value: string
    onValueChange: (value: string) => void
    tabs: Array<NomasTabTab>
}

export const NomasTab = ({ value, onValueChange, tabs }: NomasTabProps) => {
    return (
        <Tabs value={value} onValueChange={onValueChange} className="p-2 w-full bg-card-dark border-card radius-card-inner">
            <TabsList className="gap-2 flex w-full">
                {tabs.map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value} 
                        className={twMerge(
                            "flex-1",
                            "text h-10 transition-all duration-200 ease-in-out px-4 cursor-pointer", 
                            value === tab.value && "bg-button radius-button"
                        )}
                    >{tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    )
}