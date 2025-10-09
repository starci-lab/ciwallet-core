// src/components/nomas/NomasButton.tsx
import React from "react"
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "../shadcn"
import { twMerge } from "tailwind-merge"
import { NomasSpinner } from "./NomasSpinner"

export interface NomasButtonProps extends React.ComponentProps<"button"> {
  isLoading?: boolean
  isDisabled?: boolean
  xlSize?: boolean
}

export const NomasButton = React.forwardRef<HTMLButtonElement, NomasButtonProps>(
    ({ className, isLoading, isDisabled, xlSize, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                className={
                    twMerge(
                        "shadow-button bg-button h-12 bg-button:hover radius-button text-muted cursor-pointer",
                        xlSize && "h-14 text-base",
                        className
                    )}
                disabled={isDisabled || isLoading}
                {...props}
            >
                {isLoading && <NomasSpinner />}
                {props.children}
            </Button>
        )
    }
)
NomasButton.displayName = "NomasButton"

export const NomasButtonIcon = React.forwardRef<HTMLButtonElement, NomasButtonProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                size="icon-sm"
                className={
                    twMerge(
                        "shadow-button bg-button bg-button:hover rounded-full text-base cursor-pointer",
                        className
                    )}
                {...props}
            >
                {children}
            </Button>
        )
    }
)
NomasButtonIcon.displayName = "NomasButtonIcon"

export interface NomasButtonTextWithIconProps extends NomasButtonProps {
  icon: React.ReactNode
  tooltip?: string
  iconPosition?: "start" | "end"
  useGradient?: boolean
}

export const NomasButtonTextWithIcon: React.FC<NomasButtonTextWithIconProps> = (props) => {
    if (props.tooltip) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <NomasButtonTextWithIconCore {...props} />
                </TooltipTrigger>
                <TooltipContent>{props.tooltip}</TooltipContent>
            </Tooltip>
        )
    }
    return <NomasButtonTextWithIconCore {...props} />
}

const NomasButtonTextWithIconCore: React.FC<NomasButtonTextWithIconProps> = (props) => {
    const { icon, iconPosition = "end", useGradient, children, ...rest } = props

    const iconElement = (
        <div className="rounded-md grid place-items-center bg-foreground text-background">
            {icon}
        </div>
    )

    return (
        <NomasButton
            className={twMerge("pr-0 w-fit shadow-button bg-button bg-button:hover rounded-full text-muted cursor-pointer", props.className)}
            {...rest}
        >
            {iconPosition === "start" && iconElement}
            {useGradient ? (
                <span
                    className="bg-clip-text text-transparent"
                    style={{
                        backgroundImage: "linear-gradient(to right, #9ee3b0, #e6b8e0)",
                    }}
                >
                    {children}
                </span>
            ) : (
                children
            )}
            {iconPosition === "end" && iconElement}
        </NomasButton>
    )
}