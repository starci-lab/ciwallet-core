import React from "react"
import { type ChainMetadata, type Token } from "@ciwallet-sdk/types"
import { NomasButton, NomasImage } from "@/nomas/components"

export interface SelectTokenProps {
  token?: Token;
  chainMetadata?: ChainMetadata
  onSelect: (token: Token) => void;
}

export const SelectToken = ({ token, chainMetadata, onSelect }: SelectTokenProps) => {
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
            className="h-12"
            noShadow
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
                <div className="text-sm text">{token.name}</div>
                <div className="text-muted text-xs text-left">{token.symbol}</div>
            </div>
        </NomasButton>
    )
}
