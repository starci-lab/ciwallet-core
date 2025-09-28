import React from 'react';
import { type ChainMetadata, type Token } from '@ciwallet-sdk/types';
import { NomasAvatar, NomasButton } from '@/nomas/components';
import { CaretDownIcon } from '@phosphor-icons/react';
export interface ButtonSelectTokenWithdrawProps {
  token?: Token;
  chainMetadata?: ChainMetadata;
  onSelect: (token: Token) => void;
}

export const ButtonSelectTokenWithdraw = ({
  token,
  chainMetadata,
  onSelect,
}: ButtonSelectTokenWithdrawProps) => {
  if (!token) {
    return (
      <NomasButton className="mx-0 px-1">
        <NomasAvatar src={chainMetadata?.iconUrl} />
        <div>{chainMetadata?.name}</div>
      </NomasButton>
    );
  }
  return (
    <NomasButton
      className="mx-0 px-1 min-w-fit bg-content2-100"
      onPress={() => onSelect(token)}
      startContent={
        <div className="relative">
          <NomasAvatar src={token.iconUrl} />
        </div>
      }
      endContent={<CaretDownIcon size={40} weight="thin" />}
    >
      <div>
        <div className="text-foreground-500 text-xs">{token.symbol}</div>
      </div>
    </NomasButton>
  );
};
