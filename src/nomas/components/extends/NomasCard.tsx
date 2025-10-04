import React from "react"
import {
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    type CardProps,
    type CardFooterProps,
    type HTMLHeroUIProps,
} from "@heroui/react"
import { cn } from "@heroui/react"
import { IconButton } from "../styled"
import { ArrowLeftIcon } from "@phosphor-icons/react"

export interface NomasCardProps extends CardProps {
    asCore?: boolean
}
export const NomasCard = (props: NomasCardProps) => {
    return <Card {...props} className={
        cn(props.className, 
            {
                "bg-gradient-to-b from-[#2D2D2D] to-[#242424]": props.asCore,
                "border-t border-content3-200": props.asCore,
            },
        )} />
}

export const NomasCardBody = (props: HTMLHeroUIProps<"div">) => {
    return <CardBody {...props} />
}

export interface NomasCardHeaderProps extends HTMLHeroUIProps<"div"> {
    showBackButton?: boolean
    onBackButtonPress?: () => void
}
export const NomasCardHeader = (props: NomasCardHeaderProps) => {
    const { showBackButton, onBackButtonPress, title, ...rest } = props
  
    return (
        <CardHeader
            {...rest}
            className={cn("flex items-center justify-between", props.className)}
        >
            {!props.children
                ? (showBackButton
                    ? (
                        <IconButton
                            icon={<ArrowLeftIcon />}
                            onPress={onBackButtonPress}
                            className="shrink-0"
                        />
                    ) : (
                        <div className="w-9" />
                    )
                )
                : null}
            

            {/* Center */}
            {title && (
                <div className="flex-1 text-center font-medium text-lg text-foreground-100">
                    {title}
                </div>
            )}

            {/** Center Content */}
            {props.children}

            {/* Right */}
            {!props.children && (
                <div className="w-9" />
            )}
        </CardHeader>
    )
}
export const NomasCardFooter = (props: CardFooterProps) => {
    return <CardFooter {...props} />
}
