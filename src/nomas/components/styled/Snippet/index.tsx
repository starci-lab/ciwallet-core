"use client"

import React, { useState } from "react"
import { CopyIcon, CheckIcon } from "@phosphor-icons/react"
import { motion, AnimatePresence } from "framer-motion"
import type { WithClassName } from "@ciwallet-sdk/types"
import { twMerge } from "tailwind-merge"
import { NomasLink } from "../../extends"
import { toast } from "sonner"
export interface SnippetProps extends WithClassName {
  copyString: string
}

export const Snippet: React.FC<SnippetProps> = ({ copyString, className }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(copyString)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
            toast.success("Copied to clipboard", {
                icon: null,
            })
        } catch (err) {
            console.error("Failed to copy:", err)
            toast.error("Failed to copy", {
                icon: null,
            })
        }
    }

    return (
        <NomasLink onClick={handleCopy} className={twMerge("relative w-5 h-5 min-w-5 min-h-5", className)}>
            <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                    <motion.span
                        key="check"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <CheckIcon className={twMerge("w-5 h-5 min-w-5 min-h-5 text-muted", className)} />
                    </motion.span>
                ) : (
                    <motion.span
                        key="copy"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <CopyIcon className={twMerge("w-5 h-5 min-w-5 min-h-5 text-muted", className)} />
                    </motion.span>
                )}
            </AnimatePresence>
        </NomasLink>
    )
}