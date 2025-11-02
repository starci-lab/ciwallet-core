import React from "react"
import { NomasCard, NomasCardBody, NomasCardHeader, NomasButton, NomasCardVariant } from "@/nomas/components/extends"
import { useAppSelector } from "@/nomas/redux"

const WordBox = ({ index, value }: { index: number; value?: string }) => {
    return (
        <div className="bg-content1 rounded-large px-4 py-5 text-left border border-content3-300 text-black">
            <span className="text-xs mr-2 opacity-70">{index}.</span>
            <span className="text-sm text-black">{value ?? ""}</span>
        </div>
    )
}

export const Mnemonic = () => {
    const mnemonic = useAppSelector((s) => s.mnemonics.mnemonic)
    console.log("mnemonic", mnemonic)
    const words = (mnemonic ?? "").trim().split(/\s+/).filter(Boolean)
    const size = words.length === 24 ? 24 : 12
    const filled = Array.from({ length: size }, (_, i) => words[i] ?? "")

    return (
        <NomasCard variant={NomasCardVariant.Dark} className="w-full max-w-2xl mx-auto">
            <NomasCardHeader title="Secret Recovery Phrase" />
            <NomasCardBody className="flex flex-col gap-6">
                <div className="text-center text-foreground-500 text-sm">
                    Import an existing wallet using a 12 or 24–word recovery phrase
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {filled.map((w, i) => (
                        <WordBox key={i} index={i + 1} value={w} />
                    ))}
                </div>

                <NomasButton asBase className="mt-4 w-full py-6 text" disabled>
                    I&apos;ve saved my recovery phrase
                </NomasButton>
            </NomasCardBody>
        </NomasCard>
    )
}
