import React from "react"
import { Button, cn, Tooltip, type ButtonProps } from "@heroui/react"

export interface NomasButtonProps extends ButtonProps {
  asBase?: boolean;
}
export const NomasButton = (props: NomasButtonProps) => {
    return (
        <Button
            {...props}
            className={cn(
                {
                    "shadow-md border-t border-foreground-600 bg-foreground-700":
            props.asBase,
                },
                props.className
            )}
        />
    )
}

export interface NomasButtonTextWithIconProps extends NomasButtonProps {
  icon: React.ReactNode;
  useGradient?: boolean;
  tooltip?: string;
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
    return (
        <NomasButton
            size="sm"
            asBase
            className={cn("pr-0 w-fit bg-content3", props.className)}
            endContent={
                <div
                    className={cn(
                        "rounded-small w-8 h-8 grid place-items-center bg-foreground-700 text-foreground"
                    )}
                >
                    {props.icon}
                </div>
            }
        >
            {
                props.useGradient ? (
                    <div
                        className={cn("text-foreground",
                            "bg-clip-text text-transparent",
                        )}
                        style={{
                            backgroundImage: "linear-gradient(to right, #9ee3b0, #e6b8e0)"
                        }}
                    >
                        {props.children}
                    </div>
                ) : (
                    props.children
                )
            }
        </NomasButton>
    )
}
