import React, { useState } from "react"
import { Launch } from "./screen/Launch"
import { Mnemonic } from "./screen/Mnemonic"

export const AuthPage = () => {
    const [step, setStep] = useState<"launch" | "mnemonic">("launch")
    if (step === "mnemonic") {
        return <Mnemonic />
    }
    return <Launch onLaunched={() => setStep("mnemonic")} />
}
