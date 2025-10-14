import React from "react"
import { twMerge } from "tailwind-merge"
import { ArrowLeftIcon } from "@phosphor-icons/react"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "../shadcn"
import { cva } from "class-variance-authority"
import { NomasButtonIcon } from "./NomasButton"

export enum NomasCardVariant {
    Gradient = "gradient",
    Transparent = "transparent",
    Dark = "dark",
    Button = "button",
}

// NomasCard Container
export interface NomasCardProps extends React.ComponentProps<typeof Card> {
  variant?: NomasCardVariant
  isInner?: boolean
}

const cardCva = cva(
    "radius-card border text-text shadow-card py-0 gap-0", // base styles
    {
        variants: {
            variant: {
                gradient: "bg-card-gradient border-card", // gradient variant
                transparent: "bg-transparent border-none !shadow-none !border-none", // transparent variant
                dark: "bg-card-dark !shadow-none", // dark variant
                button: "bg-button shadow-button radius-button cursor-pointer border-none", // button variant
            },
            isInner: {
                true: "radius-card-inner",
                false: "radius-card",
            },
        },
        defaultVariants: {
            variant: undefined,
            isInner: false,
        },  
    }
)
  
export const NomasCard = React.forwardRef<HTMLDivElement, NomasCardProps>(
    ({ className, variant, isInner, ...props }, ref) => {
        return (
            <Card
                ref={ref}
                className={twMerge(cardCva({ variant, isInner }), className)}
                {...props}
            />
        )
    }
)
NomasCard.displayName = "NomasCard" 

// NomasCardHeader
export interface NomasCardHeaderProps
  extends React.ComponentProps<typeof CardHeader> {
  title?: string
  description?: string
  showBackButton?: boolean
  onBackButtonPress?: () => void
}

export const NomasCardHeader = React.forwardRef<
  HTMLDivElement,
  NomasCardHeaderProps
>(({ className, title, description, showBackButton, onBackButtonPress, children, ...props }, ref) => {
    return (
        <CardHeader
            ref={ref}
            className={twMerge("flex items-center justify-between p-6 pb-0", className)}
            {...props}
        >
            {/* Left: back button or spacer */}
            {showBackButton ? (
                <NomasButtonIcon
                    onClick={onBackButtonPress}
                >
                    <ArrowLeftIcon className="w-6 h-6" weight="bold" />
                </NomasButtonIcon>
            ) : (
                <div className="w-9" />
            )}

            {/* Center: title & description */}
            <div className="flex-1 text-center">
                {title && (
                    <CardTitle className="text-lg font-semibold text-muted">
                        {title}
                    </CardTitle>
                )}
                {description && (
                    <CardDescription className="text-sm text-muted">
                        {description}
                    </CardDescription>
                )}
            </div>

            {/* Right: spacer or custom children */}
            {children ? children : <div className="w-9" />}
        </CardHeader>
    )
})
NomasCardHeader.displayName = "NomasCardHeader"

// NomasCardBody (Content)
export const NomasCardBody = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CardContent>
>(({ className, ...props }, ref) => {
    return <CardContent ref={ref} className={twMerge("p-6", className)} {...props} />
})
NomasCardBody.displayName = "NomasCardBody"

// NomasCardFooter
export const NomasCardFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CardFooter>
>(({ className, ...props }, ref) => {
    return (
        <CardFooter
            ref={ref}
            className={twMerge("flex items-center justify-end p-6 pt-3", className)}
            {...props}
        />
    )
})
NomasCardFooter.displayName = "NomasCardFooter"