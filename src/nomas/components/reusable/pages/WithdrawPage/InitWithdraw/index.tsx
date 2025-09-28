import {
  NomasNumberTransparentInput,
  SelectChainTab,
} from '@/nomas/components/styled';
import {
  NomasButton,
  NomasCard,
  NomasCardBody,
  NomasCardHeader,
  NomasDivider,
} from '../../../../extends';
import {
  useAppSelector,
  useAppDispatch,
  setWithdrawChainId,
  SwapPageState,
  setSwapPage,
} from '@/nomas/redux';
import { ButtonSelectTokenWithdraw } from '../ButtonSelectTokenWithdraw';
import { ClipboardIcon, GearIcon } from '@phosphor-icons/react';
import { Input, Textarea } from '@heroui/react';
import { useWithdrawFormik } from '@/nomas/hooks/singleton/formiks/';
import { useBalance } from '@ciwallet-sdk/hooks';
import useSWR from 'swr';
import { useEffect } from 'react';

export const InitWithdraw = () => {
  const dispatch = useAppDispatch();
  const withdrawFormik = useWithdrawFormik();
  const { handle } = useBalance();

  const network = useAppSelector((state) => state.base.network);
  const withdrawChainId = useAppSelector((state) => state.withdraw.chainId);
  const chainManager = useAppSelector((state) => state.chain.manager);
  const tokenManager = useAppSelector((state) => state.token.manager);
  const token = tokenManager.getTokenById(withdrawFormik.values.tokenId);
  const chainMetadata = chainManager.getChainById(
    withdrawFormik.values.chainId,
  );
  const walletAddress = '0xA7C1d79C7848c019bCb669f1649459bE9d076DA3';

  useSWR(
    [
      'BALANCE',
      network,
      withdrawFormik.values.tokenId,
      withdrawFormik.values.chainId,
    ],
    async () => {
      if (!handle || !token) return null;

      const balance = await handle({
        chainId: withdrawFormik.values.chainId,
        network,
        address: walletAddress,
        tokenAddress: token.address,
        decimals: token.decimals,
      });
      return balance;
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 30000,
      onSuccess(data) {
        if (data) {
          const formatted = data.amount;
          withdrawFormik.setFieldValue('balance', formatted);
        }
      },
    },
  );

  useEffect(() => {
    if (token && chainMetadata) {
      withdrawFormik.setFieldValue('tokenId', token.tokenId);
      withdrawFormik.setFieldValue('chainId', chainMetadata.id);
      withdrawFormik.setFieldValue('walletAddress', walletAddress);
      withdrawFormik.setFieldValue('amount', 0);
      withdrawFormik.setFieldValue('toAddress', '');
      withdrawFormik.setFieldValue('feeOption', 'low');
      withdrawFormik.setFieldValue('comment', '');
      withdrawFormik.setFieldValue('balance', 0);
    }
  }, [token, chainMetadata]);

  return (
    <>
      <NomasCard className="bg-content2-100">
        <NomasCardBody>
          <p className="text-foreground-100">From</p>

          <SelectChainTab
            chainManager={chainManager}
            isSelected={(chainId) => chainId === withdrawChainId}
            onSelect={(chainId) => {
              dispatch(setWithdrawChainId(chainId));
            }}
          />
          <div className="flex items-center justify-between mt-4 my-2">
            {/* Left side */}
            <p className="text-foreground-100">Asset</p>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <p>Balance: {withdrawFormik.values.balance}</p>
              <NomasButton
                size="sm"
                radius="full"
                className="bg-foreground-600 border-t-2 border-l-1 border-foreground-800 hover:bg-foreground-500"
                onPress={() => {
                  console.log('Max');
                }}
              >
                Max
              </NomasButton>
            </div>
          </div>

          <NomasCard className="bg-content3-100">
            <NomasCardBody>
              <div className="flex gap-4 items-center">
                <ButtonSelectTokenWithdraw
                  token={tokenManager.getTokenById(
                    withdrawFormik.values.tokenId,
                  )}
                  chainMetadata={chainMetadata}
                  onSelect={(token) => {
                    withdrawFormik.setFieldValue('tokenId', token.tokenId);
                  }}
                />

                <NomasNumberTransparentInput
                  value={withdrawFormik.values.amount}
                  onValueChange={(value) => {
                    const numValue = Number(value);
                    if (isNaN(numValue)) {
                      withdrawFormik.setFieldValue('amount', 0);
                    }
                    withdrawFormik.setFieldValue('amount', numValue);
                  }}
                  onFocus={() => {
                    withdrawFormik.setFieldValue('amountFocused', true);
                  }}
                  isRequired
                  onBlur={() => {
                    withdrawFormik.setFieldValue('amountFocused', false);
                    withdrawFormik.setFieldTouched('amount');
                  }}
                  isInvalid={
                    !!(
                      withdrawFormik.touched.amount &&
                      withdrawFormik.errors.amount
                    )
                  }
                />
                <GearIcon size={60} />
              </div>
            </NomasCardBody>
          </NomasCard>
        </NomasCardBody>
      </NomasCard>
      <NomasDivider className="my-3" />
      <NomasCard className="bg-content2-100">
        <NomasCardBody>
          <p className="text-foreground-100">To</p>
          <Input
            endContent={<ClipboardIcon />}
            placeholder="Enter address, domain name or Telegram user"
            type="text"
            classNames={{
              inputWrapper:
                'bg-content2-200 data-[hover=true]:bg-content2-200 group-data-[focus=true]:bg-content2-200',
              innerWrapper: 'bg-content2-200',
            }}
            value={withdrawFormik.values.toAddress}
            onChange={(e) => {
              withdrawFormik.setFieldValue('toAddress', e.target.value);
            }}
          />
          <NomasDivider className="my-2" />
          <p className="text-foreground-100">Comment or memo</p>
          <Textarea
            isClearable
            placeholder="Enter comment"
            onClear={() => {
              withdrawFormik.setFieldValue('comment', '');
            }}
            classNames={{
              inputWrapper:
                'bg-content2-200 data-[hover=true]:bg-content2-200 group-data-[focus=true]:bg-content2-200',
              innerWrapper: 'bg-content2-200',
            }}
            value={withdrawFormik.values.comment}
            onChange={(e) => {
              withdrawFormik.setFieldValue('comment', e.target.value);
            }}
          />
        </NomasCardBody>
      </NomasCard>
      <NomasDivider className="my-3" />
      <NomasButton
        className="py-6"
        onPress={() => {
          console.log('Withdraw press');
          withdrawFormik.submitForm();
          console.log('Errors after submit:', withdrawFormik.errors);
        }}
      >
        Next
      </NomasButton>
    </>
  );
};
