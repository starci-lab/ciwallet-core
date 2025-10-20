import React from "react"
import { type ChainMetadata, type Token } from "@ciwallet-sdk/types"
import { NomasButton } from "@/nomas/components"
export interface SelectTokenProps {
  token?: Token;
  chainMetadata?: ChainMetadata
  onSelect: (token: Token) => void;
}

export const SelectToken = ({ token, onSelect }: SelectTokenProps) => {
    if (!token) {
        return (
            <NomasButton>
                Select Token
            </NomasButton>
        )
    }
    return (
        <NomasButton
            onClick={() => onSelect(token)}
        >
            <div>
                <div className="text-sm text">{token.name}</div>
                <div className="text-muted text-xs text-left">{token.symbol}</div>
            </div>
        </NomasButton>
    )
}
