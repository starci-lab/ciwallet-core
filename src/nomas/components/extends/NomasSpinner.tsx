import React from "react"
import { Spinner, type SpinnerProps } from "@heroui/react"
import { cva } from "class-variance-authority"

export interface NomasSpinnerProps extends SpinnerProps {
    baseSize?: "xs" | "sm"
}

const baseSizeCva = cva("text-foreground-500", {
    variants: {
        baseSize: {
            xs: "w-4 h-4",
            sm: "w-5 h-5",
        },
    },
    defaultVariants: {
        baseSize: "sm",
    },
})

const circle1Cva = cva("border-2", {
    variants: {
        baseSize: {
            xs: "w-4 h-4",
            sm: "w-5 h-5",
        },
    },
    defaultVariants: {
        baseSize: "xs",
    },
})

const circle2Cva = cva("border-2", {
    variants: {
        baseSize: {
            xs: "w-4 h-4",
            sm: "w-5 h-5",
        },
    },
    defaultVariants: {
        baseSize: "xs",
    },
})

const spinnerBarsCva = cva("", {
    variants: {
        baseSize: {
            xs: "",
            sm: "",
        },
    },
})

export const NomasSpinner = (props: NomasSpinnerProps) => {
    return <Spinner size="sm" color="current" {...props} classNames={{
        base: baseSizeCva({ baseSize: props.baseSize }),
        circle1: circle1Cva({ baseSize: props.baseSize }),
        circle2: circle2Cva({ baseSize: props.baseSize }),
        spinnerBars: spinnerBarsCva({ baseSize: props.baseSize }),
    }} />
}