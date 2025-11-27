import React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "@phosphor-icons/react"

export interface NomasCheckboxProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}
export const NomasCheckbox = ({ checked, onCheckedChange }: NomasCheckboxProps) => {
    return (
        <CheckboxPrimitive.Root
            checked={checked}
            onCheckedChange={onCheckedChange}
            className={`
          w-5 h-5 rounded-sm min-w-5 min-h-5
          border border-2 border-border
          data-[state=checked]:bg-border
          flex items-center justify-center
          transition-colors
          cursor-pointer
        `}
        >
            <CheckboxPrimitive.Indicator
                data-slot="checkbox-indicator"
                className="grid place-content-center text-current transition-none"
            >
                <CheckIcon className="size-3.5" />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    )
}