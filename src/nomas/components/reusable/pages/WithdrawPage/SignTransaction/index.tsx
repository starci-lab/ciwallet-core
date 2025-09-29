import {
  NomasAvatar,
  NomasButton,
  NomasCard,
  NomasCardBody,
  NomasDivider,
  NomasTooltip,
} from '../../../../extends';
import {
  useAppSelector,
  useAppDispatch,
  WithdrawPageState,
  setWithdrawPage,
} from '@/nomas/redux';
import { Snippet } from '@heroui/react';
import { useWithdrawFormik } from '@/nomas/hooks/singleton';
import { shortenAddress } from '@ciwallet-sdk/utils';
import { InfoIcon } from '@phosphor-icons/react';
import { useState, useEffect } from 'react';

export const SignTransaction = () => {
  const dispatch = useAppDispatch();
  const withdrawFormik = useWithdrawFormik();
  const chainManager = useAppSelector((state) => state.chain.manager);
  const tokenManager = useAppSelector((state) => state.token.manager);
  const token = tokenManager.getTokenById(withdrawFormik.values.tokenId);
  const chainMetadata = chainManager.getChainById(
    withdrawFormik.values.chainId,
  );

  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <>
      <NomasCard className="bg-content2-100 border-1 border-black">
        <NomasCardBody>
          <div className="flex flex-col justify-between items-center">
            <NomasAvatar
              className="w-20 h-20 text-large"
              src={token?.iconUrl}
            />
            <span className="text-foreground-100 text-xl font-medium">
              {token?.symbol}
            </span>
            <Snippet
              hideSymbol
              classNames={{ base: 'px-0 py-0 mt-1 bg-opacity-100 gap-0' }}
              onCopy={() => {
                navigator.clipboard.writeText(
                  withdrawFormik.values.walletAddress,
                );
              }}
            >
              {shortenAddress(withdrawFormik.values.walletAddress)}
            </Snippet>
            <span className="text-foreground-100 text-2xl font-medium">
              {withdrawFormik.values.amount}
            </span>
            <span className="text-foreground-100 text-medium font-normal">
              $ {(parseFloat(withdrawFormik.values.amount) * 3.5).toFixed(4)}
            </span>
            <NomasDivider
              orientation="horizontal"
              className="pt-[5]px my-3 bg-foreground-100"
            />
            <div className="flex flex-col w-full gap-2">
              <div className="flex justify-between items-center">
                <p className="text-foreground-100 text-sm font-normal">To</p>
                <p>{withdrawFormik.values.toAddress}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-foreground-100 text-sm font-normal">Chain</p>
                <div>
                  <NomasAvatar
                    className="w-5 h-5 inline-block mr-1"
                    src={chainMetadata?.iconUrl}
                    alt={chainMetadata?.name}
                  />
                  <span className="align-middle">{chainMetadata?.name}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <p className="text-foreground-100 text-sm font-normal">Fee</p>
                  <NomasTooltip content={'The fee is charged by the network'}>
                    <InfoIcon />
                  </NomasTooltip>
                </div>
                <p className="text-sm font-normal">
                  ${withdrawFormik.values.fee}
                </p>
              </div>
            </div>
          </div>
        </NomasCardBody>
      </NomasCard>
      <NomasDivider className="my-2" />
      <NomasCard className="bg-content2-100">
        <NomasCardBody>
          <p className="">Comment or memo</p>
          <p className="text-xs">
            {withdrawFormik.values.comment || 'No comment'}
          </p>
        </NomasCardBody>
      </NomasCard>
      <NomasDivider className="my-3" />
      <NomasButton
        className="py-6"
        onPress={() => {
          dispatch(setWithdrawPage(WithdrawPageState.ProcessTransaction));
        }}
        isDisabled={countdown > 0}
      >
        {countdown > 0 ? `Confirm after (${countdown}s)` : 'Send'}
      </NomasButton>
    </>
  );
};
