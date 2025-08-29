import React from "react"
import { type ChainMetadata, type Token } from "@ciwallet-sdk/types"
import { NomasAvatar, NomasButton } from "@/nomas/components"
import { CaretDownIcon } from "@phosphor-icons/react"
export interface SelectTokenProps {
  token?: Token;
  chainMetadata?: ChainMetadata
  onSelect: (token: Token) => void;
}

export const SelectToken = ({ token, chainMetadata, onSelect }: SelectTokenProps) => {
    if (!token) {
        return (
            <NomasButton>
                <NomasAvatar src={chainMetadata?.iconUrl} />
                <div>{chainMetadata?.name}</div>
            </NomasButton>
        )
    }
    return (
        <NomasButton
            onPress={() => onSelect(token)}
            startContent={
                <div className="relative">
                    <NomasAvatar src={token.iconUrl} />
                    <NomasAvatar
                        src={chainMetadata?.iconUrl}
                        className="absolute bottom-0 right-0 z-50"
                        dimension="shrink"
                    />
                </div>
            }
            endContent={
                <CaretDownIcon />
            }
        >
            <div>
                <div className="text-sm">{token.name}</div>
                <div className="text-foreground-500 text-xs">{token.symbol}</div>
            </div>
        </NomasButton>
    )
}
