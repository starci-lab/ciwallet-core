import React, { type PropsWithChildren } from "react"
import type { WithClassName } from "@ciwallet-sdk/types"
import { twMerge } from "tailwind-merge"

export interface NomasSkeletonProps extends WithClassName, PropsWithChildren {
    isLoading: boolean
}
export const NomasSkeleton = ({ className, isLoading, children }: NomasSkeletonProps) => {
    if (isLoading) {
        return <div className={twMerge("animate-pulse bg-skeleton/30 rounded-skeleton", className)} />
    }
    return <>{children}</>
}