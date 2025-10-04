import React from "react"
import { Button, cn, Tooltip, type ButtonProps } from "@heroui/react"

export interface NomasButtonProps extends ButtonProps {
    asBase?: boolean;
}

export const NomasButton = (props: NomasButtonProps) => {
    return (
        <Button
            {...props}
            className={
                cn(
                    {
                        "shadow-md border-t border-content3-200": props.asBase,
                        "bg-content3-100": !props.asBase,
                    },
                    props.className
                )}
        />
    )
}

export const NomasButtonIcon = (props: NomasButtonProps) => {
    return (
        <Button
            isIconOnly
            size="sm"
            asBase
            className={cn("rounded-full border-foreground-600 bg-foreground-700", props.className)}
            {...props}
        >
            {props.children}
        </Button>
    )
}

export interface NomasButtonTextWithIconProps extends NomasButtonProps {
  icon: React.ReactNode;
  useGradient?: boolean;
  tooltip?: string;
  startContent?: React.ReactNode;
  iconPosition?: "start" | "end";
}

export const NomasButtonTextWithIcon = (props: NomasButtonTextWithIconProps) => {
    if (props.tooltip) {
        return (
            <Tooltip content={props.tooltip}>
                <NomasButtonTextWithIconCore {...props} />
            </Tooltip>
        )
    }
    return (
        <NomasButtonTextWithIconCore {...props} />
    )
}

const NomasButtonTextWithIconCore = (
    props: NomasButtonTextWithIconProps
) => {
    const { iconPosition = "end", icon, ...restProps } = props

    const iconElement = (
        <div
            className={cn(
                "rounded-small w-8 h-8 grid place-items-center bg-foreground-700 text-foreground"
            )}
        >
            {icon}
        </div>
    )

    return (
        <NomasButton
            size="sm"
            asBase
            className={cn("pr-0 w-fit bg-content3-300 text-sm", props.className)}
            endContent={iconPosition === "end" ? iconElement : undefined}
            startContent={iconPosition === "start" ? iconElement : undefined}
            {...restProps}
        >
            {props.useGradient ? (
                <div
                    className={cn("text-foreground", "bg-clip-text text-transparent")}
                    style={{
                        backgroundImage: "linear-gradient(to right, #9ee3b0, #e6b8e0)",
                    }}
                >
                    {props.children}
                </div>
            ) : (
                props.children
            )}
        </NomasButton>
    )
}
