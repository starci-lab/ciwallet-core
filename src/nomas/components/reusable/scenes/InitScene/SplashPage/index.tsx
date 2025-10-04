import { NomasCard, NomasCardBody } from "@/nomas/components/extends"
import { useAppDispatch } from "@/nomas/redux"
import React, { useEffect } from "react"

export const SplashPage = () => {
    const dispatch = useAppDispatch()
    useEffect(() => {
        setTimeout(() => {
            console.log("SplashPage")
        }, 1000)
    }, [])
    return (
        <NomasCard
            asCore
        >
            <NomasCardBody className="flex flex-col items-center gap-8">
                <div className="w-16 h-16 rounded-full grid place-items-center bg-content3-200/30 border border-content3-100">
                    <img src="/icons/common/nomas-logo.png" alt="Nomas Wallet" className="w-16 h-16" />
                </div>
            </NomasCardBody>
        </NomasCard>
    )
}