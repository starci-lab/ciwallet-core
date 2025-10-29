// src/components/nomas/NomasButton.tsx
import React from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../shadcn"
import { twMerge } from "tailwind-merge"
import { NomasSpinner } from "./NomasSpinner"
import { motion } from "framer-motion"
import type { HTMLMotionProps } from "framer-motion"
export interface NomasButtonProps extends HTMLMotionProps<"button"> {
  isLoading?: boolean
  isDisabled?: boolean
  xlSize?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  noShadow?: boolean
  children: React.ReactNode
}

export const NomasButton = React.forwardRef<HTMLButtonElement, NomasButtonProps>(
    ({ className, isLoading, isDisabled, xlSize, startIcon, endIcon, noShadow, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: 0.95 }}
                className={
                    twMerge(
                        "block flex items-center relative px-4 gap-2 justify-center",
                        "shadow-button bg-button-dark h-10 radius-button text-muted cursor-pointer",
                        xlSize && "h-14 text",
                        noShadow && "!shadow-none bg-button",
                        className
                    )}
                disabled={isDisabled || isLoading}
                {...props}
            >
                {!isLoading && startIcon && startIcon}
                {isLoading && <NomasSpinner />}
                {props.children}
                {endIcon && endIcon}
            </motion.button>
        )
    }
)
NomasButton.displayName = "NomasButton"

export const NomasButtonIcon = React.forwardRef<HTMLButtonElement, NomasButtonProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: 0.95 }}
                className={
                    twMerge(
                        "shadow-button bg-button rounded-full w-10 h-10 text cursor-pointer flex items-center justify-center",
                        className
                    )}
                {...props}
            >
                {children}
            </motion.button>
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
        <div
            className={twMerge(
                "flex items-center justify-center",
                "grid place-items-center h-full px-3 bg-button-nohover transition-colors duration-200 group-hover:bg-button-hover"
            )}
        >
            {icon}
        </div>
    )
  
    return (
        <NomasButton
            className={twMerge(
                // Base styles
                "group relative p-0 w-fit bg-button-dark text rounded-full text-muted cursor-pointer flex items-center justify-center",
                props.className
            )}
            {...rest}
        >
            <div className="absolute w-full h-full shadow-button radius-button"/>
            {iconPosition === "start" && iconElement}
            <div className="pl-3">
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
            </div>
            {iconPosition === "end" && iconElement}
        </NomasButton>
    )
}
