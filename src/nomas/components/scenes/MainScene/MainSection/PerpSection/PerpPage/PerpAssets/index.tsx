import { NomasButton } from "@/nomas/components"
import React from "react"
import { setPerpSectionPage, useAppDispatch } from "@/nomas/redux"
import { PerpSectionPage } from "@/nomas/redux"

export const PerpAssets = () => {
    const dispatch = useAppDispatch()
    return <div>
        <NomasButton 
            xlSize 
            className="w-full" 
            onClick={() => dispatch(setPerpSectionPage(PerpSectionPage.Deposit))}
        >
            Deposit
        </NomasButton>
    </div>
}