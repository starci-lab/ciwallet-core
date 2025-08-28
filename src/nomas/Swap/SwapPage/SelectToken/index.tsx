import React from "react"
import { type Token } from "@ciwallet-sdk/types"
import { NomasAvatar, NomasButton } from "@/nomas/components"
import { CaretDownIcon } from "@phosphor-icons/react"
export interface SelectTokenProps {
  token: Token;
  onSelect: (token: Token) => void;
}

export const SelectToken = ({ token, onSelect }: SelectTokenProps) => {
    return (
        <NomasButton
            onPress={() => onSelect(token)}
            startContent={
                <div className="relative">
                    <NomasAvatar src={token.iconUrl} />
                    <NomasAvatar
                        src={token.iconUrl}
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
