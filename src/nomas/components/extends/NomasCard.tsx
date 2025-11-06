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
import { NomasDivider, NomasSpacer } from "@/nomas/components"

export enum NomasCardVariant {
    Gradient = "gradient",
    Gradient2 = "gradient2",
    Transparent = "transparent",
    Dark = "dark",
    Button = "button",
}

// NomasCard Container
export interface NomasCardProps extends React.ComponentProps<typeof Card> {
  variant?: NomasCardVariant
  isInner?: boolean
  isContainer?: boolean
}

const cardCva = cva(
    "rounded-card border text-text shadow-shadow-card py-0 gap-0 overflow-hidden", // base styles
    {
        variants: {
            variant: {
                gradient: "bg-card-gradient border-border-card", // gradient variant
                gradient2: "bg-card-gradient2 border-border-card", // gradient2 variant
                transparent: "bg-transparent border-none !shadow-none !border-none", // transparent variant
                dark: "border-border-card bg-card-dark !shadow-none", // dark variant
                button: "bg-button shadow-button rounded-button cursor-pointer border-none", // button variant
            },
            isInner: {
                true: "rounded-card-inner",
                false: "rounded-card",
            },
            isContainer: {
                true: "min-w-[400px] w-[400px] max-w-[400px]",
                false: "",
            },
        },
        defaultVariants: {
            variant: undefined,
            isInner: false,
            isContainer: false,
        },  
    }
)
  
export const NomasCard = React.forwardRef<HTMLDivElement, NomasCardProps>(
    ({ className, variant, isInner, isContainer, ...props }, ref) => {
        return (
            <Card
                ref={ref}
                className={twMerge(cardCva({ variant, isInner, isContainer }), className)}
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
  startIcon?: React.ReactNode
  description?: string
  showBackButton?: boolean
  addDivider?: boolean
  onBackButtonPress?: () => void
  hideLeftBlankSpace?: boolean
}

export const NomasCardHeader = React.forwardRef<
  HTMLDivElement,
  NomasCardHeaderProps
>(({ className, title, description, showBackButton, onBackButtonPress, startIcon, children, addDivider, hideLeftBlankSpace, ...props }, ref) => {
    return (
        <CardHeader
            ref={ref}
            className={twMerge("gap-0 p-6 pb-0", className)}
            {...props}
        >
            <div className="flex items-center pb-0">
                {/* Left: back button or spacer */}
                {showBackButton ? (
                    <NomasButtonIcon
                        onClick={onBackButtonPress}
                        roundedFull
                    >
                        <ArrowLeftIcon className="w-5 h-5 text-muted" />
                    </NomasButtonIcon>
                ) : (
                    !hideLeftBlankSpace ? <div className="w-9" /> : null
                )}

                {/* Center: title & description */}
                <div className="flex-1 text-center">
                    {title && (
                        <CardTitle className="text-lg font-semiboldtext-text-muted flex items-center gap-2 justify-center">
                            {startIcon}
                            {title}
                        </CardTitle>
                    )}
                </div>

                {/* Right: spacer or custom children */}
                {children ? children : <div className="w-10" />}
            </div>
            {description && (
                <>
                    <NomasSpacer y={4} />
                    <CardDescription className="text-smtext-text-muted text-center text-text-muted-dark">
                        {description}
                    </CardDescription>
                </>
            )}
            {addDivider && (
                <>
                    <NomasSpacer y={4} />
                    <NomasDivider orientation="horizontal"/>
                </>
            )}
        </CardHeader>
    )
})
NomasCardHeader.displayName = "NomasCardHeader"

export interface NomasCardBodyProps
  extends React.ComponentProps<typeof CardContent> {
  scrollable?: boolean
  scrollHeight?: number // optional: limit vùng hiển thị
}

export const NomasCardBody = React.forwardRef<
  HTMLDivElement,
  NomasCardBodyProps
>(({ className, scrollable, scrollHeight = 300, children, ...props }, ref) => {
    return (
        <CardContent
            ref={ref}
            className={twMerge(
                "p-6 overflow-hidden relative select-none",
                scrollable && "overflow-y-auto h-full hide-scrollbar will-change-transform",
                className
            )}
            style={{ 
                height: scrollable ? `${scrollHeight}px` : undefined,
                maxHeight: scrollable ? `${scrollHeight}px` : undefined,
                minHeight: scrollable ? `${scrollHeight}px` : undefined,
            }}
            {...props}
        >
            {children}
        </CardContent>
    )
})

// NomasCardFooter
export const NomasCardFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CardFooter>
>(({ className, ...props }, ref) => {
    return (
        <CardFooter
            ref={ref}
            className={twMerge("flex items-center justify-end p-6 pt-0", className)}
            {...props}
        />
    )
})
NomasCardFooter.displayName = "NomasCardFooter"