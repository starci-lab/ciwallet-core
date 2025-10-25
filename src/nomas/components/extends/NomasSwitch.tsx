import React, { useEffect, useRef } from "react"
import { Switch } from "../shadcn"
import JSConfetti from "js-confetti"
import type { WithClassName } from "@ciwallet-sdk/types"

export interface NomasSwitchProps extends WithClassName {
    addConfetti?: boolean
}
export const NomasSwitch = (
    props: NomasSwitchProps & React.ComponentProps<typeof Switch>
) => {
    return (
        <Switch {...props} onClick={
            (event: React.MouseEvent<HTMLButtonElement>) => {
                if (props.addConfetti && !props.checked) {
                    const confetti = new JSConfetti()
                    confetti.addConfettiAtPosition({
                        confettiRadius: 2,
                        confettiNumber: 10,
                        emojis: ["🌈", "⚡️", "💥", "✨", "💫", "🌸"],
                        confettiDispatchPosition: { x: event.clientX, y: event.clientY },
                    })
                }
            }} />
    )
}