import React from "react"
//import { Swap } from "./components"
import { Mnemonic } from "@ciwallet-sdk/classes"
//import { PotfolioPage } from "./components/reusable/pages"

export const Nomas = () => {
    const mnemonic = new Mnemonic()
    return (
        <> 
            {/* <PotfolioPage/> */}
            <div className="text-red-500">{mnemonic.generate(true)}</div>
        </>
    )
}