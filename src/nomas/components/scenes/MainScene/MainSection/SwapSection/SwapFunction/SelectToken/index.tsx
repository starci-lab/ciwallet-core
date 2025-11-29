import React from "react"
import { type ChainMetadata, type Token } from "@ciwallet-sdk/types"
import { NomasButton, NomasImage } from "@/nomas/components"
import { QuestionIcon } from "@phosphor-icons/react"

export interface SelectTokenProps {
  token?: Token;
  chainMetadata?: ChainMetadata
  onSelect: () => void;
}

export const SelectToken = ({ token, chainMetadata, onSelect }: SelectTokenProps) => {
    if (!token) {
        return (
            <NomasButton className="h-12" startIcon={<QuestionIcon className="w-8 h-8" />} onClick={() => onSelect()}>
                Select
            </NomasButton>
        )
    }
    return (
        <NomasButton
            onClick={() => onSelect()}
            className="h-12"
        >
            <div className="relative">
                <NomasImage 
                    className="rounded-full w-8 h-8"
                    src={token.iconUrl}
                />
                <NomasImage
                    className="absolute bottom-0 right-0 z-50 w-4 h-4 rounded-full ring ring-offset-1 ring-transparent ring-offset-transparent"
                    src={chainMetadata?.iconUrl}
                />
            </div>
            <div>
                <div className="text-sm text-text">{token.name}</div>
                <div className="text-muted text-xs text-left">{token.symbol}</div>
            </div>
        </NomasButton>
    )
}
