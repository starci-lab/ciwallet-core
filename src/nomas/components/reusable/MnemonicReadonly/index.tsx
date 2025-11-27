import React, { useMemo } from "react"
import { NomasInput } from "../../extends"
import { mnemonicObj } from "@/nomas/obj"

export interface MnemonicReadonlyProps {
  mnemonic: string
}

/**
 * MnemonicInput — allows user to enter 12 or 24-word mnemonic phrase.
 * Automatically syncs the combined string into `mnemonic`.
 */
export const MnemonicReadonly: React.FC<MnemonicReadonlyProps> = ({
    mnemonic,
}) => {
    // Split current mnemonic into an array (always length 12 or 24)
    const words = useMemo(() => {
        const arr = mnemonic.trim().split(/\s+/).filter(Boolean)
        // fill empty slots for consistent grid
        return Array.from({ length: 24 }, (_, i) => arr[i] || "")
    }, [mnemonic])

    return (
        <div className="flex flex-col gap-6">
            <div
                className="grid gap-3 grid-cols-3 w-full"
            >
                {words.map((word, index) => (
                    <NomasInput
                        key={index}
                        value={word}
                        prefixIcon={<div className="text-sm">{index + 1}.</div>}
                        onValueChange={() => {}}
                        className="text-center text-sm"
                        isInvalid={word ? !mnemonicObj.validateWord(word) : false}
                        readOnly={true}
                    />
                ))}
            </div>
        </div>
    )
}