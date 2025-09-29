import {
  NomasAvatar,
  NomasButton,
  NomasCard,
  NomasCardBody,
  NomasDivider,
  NomasLink,
  NomasTooltip,
} from '../../../../extends';
import {
  useAppSelector,
  useAppDispatch,
  setWithdrawPage,
  WithdrawPageState,
} from '@/nomas/redux';
import { InfoIcon } from '@phosphor-icons/react';
import { useWithdrawFormik } from '@/nomas/hooks/singleton/formiks';
import { formatBigInt } from '@ciwallet-sdk/utils';

export const ResultTransaction = () => {
  const dispatch = useAppDispatch();
  const withdrawFormik = useWithdrawFormik();

  const chainManager = useAppSelector((state) => state.chain.manager);
  const tokenManager = useAppSelector((state) => state.token.manager);
  const token = tokenManager.getTokenById(withdrawFormik.values.tokenId);
  const chainMetadata = chainManager.getChainById(
    withdrawFormik.values.chainId,
  );
  return (
    <>
      <NomasCard className="bg-content3-100 border-1 border-foreground-700">
        <NomasCardBody>
          <NomasCard className="bg-content3-100 text-foreground-700">
            <NomasCardBody>
              <div className="flex flex-col items-center justify-center">
                <NomasAvatar
                  className="w-20 h-20 text-large mt-1 mb-3"
                  src={
                    withdrawFormik.values.result?.status
                      ? '/icons/common/success.png'
                      : '/icons/common/failed.png'
                  }
                />
                <p className="text-foreground-100 text-xl">
                  Send {token?.symbol}{' '}
                  {withdrawFormik.values.result?.status ? 'Success' : 'Failed'}
                </p>
                <p className="text-foreground-100 text-2xl my-1">
                  {withdrawFormik.values.amount}
                </p>
                <p className="text-foreground-200">
                  ${(parseFloat(withdrawFormik.values.amount) * 3.5).toFixed(4)}
                </p>
                <NomasLink
                  className="mt-2"
                  color="foreground"
                  isExternal
                  showAnchorIcon
                  underline="always"
                  href={`https://monad-testnet.socialscan.io/tx/${withdrawFormik.values.result?.data?.signature}`}
                >
                  View on {chainMetadata?.name} Explorer
                </NomasLink>
              </div>
              <NomasDivider
                orientation="horizontal"
                className="pt-[5]px my-3 bg-foreground-100"
              />
              <div className="flex flex-col w-full gap-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-normal">To</p>
                  <p className="text-foreground-100">
                    {withdrawFormik.values.toAddress}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-normal">Chain</p>
                  <div>
                    <NomasAvatar
                      className="w-5 h-5 inline-block mr-1"
                      src={chainMetadata?.iconUrl}
                      alt={chainMetadata?.name}
                    />
                    <span className=" text-foreground-100 align-middle">
                      {chainMetadata?.name}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-normal">Fee</p>
                    <NomasTooltip content={'The fee is charged by the network'}>
                      <InfoIcon />
                    </NomasTooltip>
                  </div>
                  <p className="text-foreground-100 text-sm font-normal">
                    {formatBigInt(
                      withdrawFormik.values.result?.data?.fee,
                      token?.decimals,
                    )}
                  </p>
                </div>
              </div>
            </NomasCardBody>
          </NomasCard>
        </NomasCardBody>
      </NomasCard>
      <NomasDivider className="my-3" />
      <NomasButton
        className="py-6 border-1 border-foreground-700"
        onPress={() => {
          console.log('Result');
          dispatch(setWithdrawPage(WithdrawPageState.InitWithdraw));
        }}
      >
        Proceed
      </NomasButton>
    </>
  );
};
