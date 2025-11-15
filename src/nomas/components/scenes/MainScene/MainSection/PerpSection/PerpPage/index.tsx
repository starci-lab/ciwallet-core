import React from "react"
import { PerpHeader } from "./PerpHeader"
import { NomasCardBody, NomasSpacer } from "@/nomas/components"
import { PerpBody } from "./PerpBody"
import { PerpTrade } from "./PerpTrade"

export const PerpPage = () => {
    return (
        <NomasCardBody>
            <PerpHeader />
            <NomasSpacer y={6}/>    
            <PerpBody />
            <NomasSpacer y={6}/> 
            <PerpTrade />
        </NomasCardBody>
    )
}