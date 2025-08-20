import React from "react"
import { Nomas } from "./nomas"
import { HeroUIProvider } from "@heroui/react"

function App() {
    return (
        <HeroUIProvider>
            <Nomas/>
        </HeroUIProvider>
    )
}

export default App
