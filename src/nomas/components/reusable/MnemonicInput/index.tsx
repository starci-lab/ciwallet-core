import React, { useMemo, useCallback, useEffect } from "react"
import { NomasCheckbox, NomasInput } from "../../extends"
import { toast } from "sonner"
import { mnemonicObj } from "@/nomas/obj"

export interface MnemonicInputProps {
  mnemonic: string
  setMnemonic: (mnemonic: string) => void
  use24Words: boolean
  setUse24Words: (use24Words: boolean) => void
  isReadOnly?: boolean
}

/**
 * MnemonicInput — allows user to enter 12 or 24-word mnemonic phrase.
 * Automatically syncs the combined string into `mnemonic`.
 */
export const MnemonicInput: React.FC<MnemonicInputProps> = ({
    mnemonic,
    setMnemonic,
    use24Words,
    setUse24Words,
    isReadOnly = false,
}) => {
    // Split current mnemonic into an array (always length 12 or 24)
    const words = useMemo(() => {
        const arr = mnemonic.trim().split(/\s+/).filter(Boolean)
        const targetLength = use24Words ? 24 : 12
        // fill empty slots for consistent grid
        return Array.from({ length: targetLength }, (_, i) => arr[i] || "")
    }, [mnemonic, use24Words])

    // Update a single word
    const handleWordChange = useCallback(
        (index: number, newWord: string) => {
            const updated = [...words]
            updated[index] = newWord.trim()
            setMnemonic(updated.join(" ").trim())
        },
        [words, setMnemonic]
    )

    // Handle toggle between 12 and 24 words
    const handleToggle = (use24: boolean) => {
        setUse24Words(use24)
        // When switching from 24 → 12, truncate mnemonic
        if (!use24) {
            const truncated = words.slice(0, 12).join(" ").trim()
            setMnemonic(truncated)
        }
    }
    // when receive ctrl+v, check if the pasted text-textis a valid mnemonic
    useEffect(() => {
        const handlePaste = (event: ClipboardEvent) => {
            const pastedText = event.clipboardData?.getData("text")
            if (!pastedText) return
            if (mnemonicObj.validateMnemonic(pastedText)) {
                setMnemonic(pastedText)
            } else {
                toast.error("Invalid mnemonic")
            }
        }
        window.addEventListener("paste", handlePaste as EventListener)
        return () => window.removeEventListener("paste", handlePaste as EventListener)
    }, [setMnemonic])

    return (
        <div className="flex flex-col gap-6">
            {/* Toggle: 12 / 24 words */}
            <div className="flex items-center gap-6 justify-center">
                <label className="flex items-center gap-2 cursor-pointer">
                    <NomasCheckbox
                        checked={!use24Words}
                        onCheckedChange={() => handleToggle(false)}
                    />
                    <span className="text-sm text-muted">12 words</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <NomasCheckbox
                        checked={use24Words}
                        onCheckedChange={() => handleToggle(true)}
                    />
                    <span className="text-sm text-muted">24 words</span>
                </label>
            </div>

            {/* Input grid */}
            <div
                className="grid gap-3 grid-cols-3 w-full"
            >
                {words.map((word, index) => (
                    <NomasInput
                        key={index}
                        value={word}
                        prefixIcon={<div className="text-sm">{index + 1}.</div>}
                        onValueChange={(val) => handleWordChange(index, val)}
                        className="text-center text-sm"
                        isInvalid={word ? !mnemonicObj.validateWord(word) : false}
                        readOnly={isReadOnly}
                    />
                ))}
            </div>
        </div>
    )
}