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

export const NomasCard = (props: CardProps) => {
    return <Card {...props} />
}
export const NomasCardBody = (props: HTMLHeroUIProps<"div">) => {
    return <CardBody {...props} />
}
export const NomasCardHeader = (props: HTMLHeroUIProps<"div">) => {
    return <CardHeader {...props} className={cn(props.className, "justify-center")} />
}
export const NomasCardFooter = (props: CardFooterProps) => {
    return <CardFooter {...props} />
}
