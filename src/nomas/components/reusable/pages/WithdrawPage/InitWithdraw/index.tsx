import {
  NomasNumberTransparentInput,
  SelectChainTab,
} from '@/nomas/components/styled';
import {
  NomasButton,
  NomasCard,
  NomasCardBody,
  NomasDivider,
  NomasSpinner,
} from '../../../../extends';
import {
  useAppSelector,
  useAppDispatch,
  setWithdrawChainId,
  setWithdrawPage,
  WithdrawPageState,
} from '@/nomas/redux';
import { ButtonSelectTokenWithdraw } from '../ButtonSelectTokenWithdraw';
import { ClipboardIcon, GearIcon } from '@phosphor-icons/react';
import { cn, Input, Textarea } from '@heroui/react';
import { useWithdrawFormik } from '@/nomas/hooks/singleton/formiks/';
import { useBalance } from '@ciwallet-sdk/hooks';
import useSWR from 'swr';
import { useEffect } from 'react';

export const InitWithdraw = () => {
  const dispatch = useAppDispatch();
  const withdrawFormik = useWithdrawFormik();
  const { handle } = useBalance();

  const withdrawPageState = useAppSelector(
    (state) => state.withdraw.withdrawPage,
  );
  const network = useAppSelector((state) => state.base.network);
  const withdrawChainId = useAppSelector((state) => state.withdraw.chainId);
  const chainManager = useAppSelector((state) => state.chain.manager);
  const tokenManager = useAppSelector((state) => state.token.manager);
  const token = tokenManager.getTokenById(withdrawFormik.values.tokenId);
  const chainMetadata = chainManager.getChainById(
    withdrawFormik.values.chainId,
  );
  const walletAddress = '0xA7C1d79C7848c019bCb669f1649459bE9d076DA3';

  useEffect(() => {
    // withdrawFormik.resetForm();
  }, []);

  const { isLoading: isBalanceLoading } = useSWR(
    [
      'BALANCE',
      network,
      withdrawFormik.values.tokenId,
      withdrawFormik.values.chainId,
    ],
    async () => {
      withdrawFormik.setFieldValue('balance', 0);

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
      // withdrawFormik.resetForm();
      withdrawFormik.setFieldValue('tokenId', token.tokenId);
      withdrawFormik.setFieldValue('chainId', chainMetadata.id);
      withdrawFormik.setFieldValue('walletAddress', walletAddress);
      withdrawFormik.setFieldValue('amount', 0);
      withdrawFormik.setFieldValue('toAddress', '');
      withdrawFormik.setFieldValue('feeOption', 'low');
      withdrawFormik.setFieldValue('comment', '');
    }

    console.log(
      'formik values after token/chain change:',
      withdrawFormik.values,
    );
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
              withdrawFormik.setFieldValue('chainId', chainId);
              withdrawFormik.setFieldValue(
                'tokenId',
                tokenManager.getNativeToken(chainId, network)?.tokenId,
              );
            }}
          />
          <div className="flex items-center justify-between mt-4 my-2">
            {/* Left side */}
            <p className="text-foreground-100">Asset</p>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <div className="text-foreground-100">
                Balance:{' '}
                <span>
                  {isBalanceLoading ? (
                    <NomasSpinner />
                  ) : (
                    withdrawFormik.values.balance
                  )}
                </span>
              </div>
              <NomasButton
                size="sm"
                radius="full"
                className="bg-foreground-600 border-t-2 border-l-1 border-foreground-800 hover:bg-foreground-500"
                onPress={() => {
                  withdrawFormik.setFieldValue(
                    'amount',
                    withdrawFormik.values.balance,
                  );
                }}
              >
                Max
              </NomasButton>
            </div>
          </div>

          <NomasCard
            className={`bg-content3-100 ${
              withdrawFormik.errors.amount && withdrawFormik.touched.amount
                ? 'border-1 border-red-500'
                : ''
            }`}
          >
            <NomasCardBody>
              <div className="flex gap-4 items-center">
                <ButtonSelectTokenWithdraw
                  token={token}
                  chainMetadata={chainMetadata}
                  onSelect={() => {
                    dispatch(setWithdrawPage(WithdrawPageState.ChooseTokenTab));
                  }}
                />

                <NomasNumberTransparentInput
                  value={withdrawFormik.values.amount}
                  onValueChange={(value) => {
                    withdrawFormik.setFieldValue('amount', value ?? '0');
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
            value={withdrawFormik.values.toAddress}
            onChange={(e) => {
              withdrawFormik.setFieldValue('toAddress', e.target.value);
            }}
            onFocus={() => {
              withdrawFormik.setFieldValue('toAddressFocused', true);
            }}
            isRequired
            onBlur={() => {
              withdrawFormik.setFieldValue('toAddressFocused', false);
              withdrawFormik.setFieldTouched('toAddress');
            }}
            isInvalid={
              !!(
                withdrawFormik.touched.toAddress &&
                withdrawFormik.errors.toAddress
              )
            }
            classNames={{
              inputWrapper: cn(
                '!bg-content2-200 data-[hover=true]:!bg-content2-200 group-data-[focus=true]:!bg-content2-200',
                ` ${
                  withdrawFormik.errors.toAddress &&
                  withdrawFormik.touched.toAddress
                    ? 'border-1 border-red-500'
                    : ''
                }`,
              ),
              innerWrapper: '!bg-content2-200',
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
        onPress={async () => {
          console.log('Withdraw press');
          // withdrawFormik.submitForm();
          // console.log('Errors after submit:', withdrawFormik.errors);
          const isValid = withdrawFormik.isValid;
          if (isValid) {
            dispatch(setWithdrawPage(WithdrawPageState.SignTransaction));
          }
        }}
        disabled={!withdrawFormik.isValid}
      >
        Next
      </NomasButton>
    </>
  );
};
