import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react"
import type { WithClassName } from "packages"
import React from "react"
import { NomasLink } from "../../extends"
import { cva } from "class-variance-authority"

export interface CaretUpDownProps extends WithClassName {
  isUp?: boolean;
  setIsUp?: (isUp: boolean) => void;
  size?: "xs" | "sm";
}
const iconCva = cva("", {
    variants: {
        size: {
            xs: "w-4 h-4",
            sm: "h-5 h-5",
        },
    },
    defaultVariants: {
        size: "sm",
    },
})

export const CaretUpDown = (props: CaretUpDownProps) => {
    const { isUp, setIsUp, className, size } = props

    return (
        <NomasLink
            color="foreground"
            className={className}
            onClick={() => {
                setIsUp?.(!isUp)
            }}
        >
            {isUp ? (
                <CaretUpIcon className={iconCva({ size })} />
            ) : (
                <CaretDownIcon className={iconCva({ size })} />
            )}
        </NomasLink>
    )
}

export default CaretUpDown
