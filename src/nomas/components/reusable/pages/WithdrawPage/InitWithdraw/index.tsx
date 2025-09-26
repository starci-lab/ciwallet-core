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
import { useBalance } from '@ciwallet-sdk/hooks';
import { ButtonSelectTokenWithdraw } from '../ButtonSelectTokenWithdraw';
import { ClipboardIcon, GearIcon } from '@phosphor-icons/react';
import { Input, Textarea } from '@heroui/react';
import { useSwapFormik } from '@/nomas/hooks/singleton/formiks/useSwapFormik';

export const InitWithdraw = () => {
  const dispatch = useAppDispatch();
  const chainManager = useAppSelector((state) => state.chain.manager);
  const withdrawChainId = useAppSelector((state) => state.withdraw.chainId);
  const tokenManager = useAppSelector((state) => state.token.manager);
  const swapFormik = useSwapFormik();
  const { handle } = useBalance();
  const network = useAppSelector((state) => state.base.network);
  const tokenInEntity = tokenManager.getTokenById(swapFormik.values.tokenIn);
  const tokenOutEntity = tokenManager.getTokenById(swapFormik.values.tokenOut);
  const tokenOutChainMetadata = chainManager.getChainById(
    swapFormik.values.tokenOutChainId,
  );
  return (
    <>
      <NomasCard className="bg-content2">
        <NomasCardBody>
          <p className="">From</p>

          <SelectChainTab
            chainManager={chainManager}
            isSelected={(chainId) => chainId === withdrawChainId}
            onSelect={(chainId) => {
              dispatch(setWithdrawChainId(chainId));
            }}
          />
          <div className="flex items-center justify-between mt-4 my-2">
            {/* Left side */}
            <p>Asset</p>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <p>Balance: 554.226</p>
              <NomasButton
                size="sm"
                radius="full"
                className="bg-foreground-700"
                onPress={() => {
                  console.log('Max');
                }}
              >
                Max
              </NomasButton>
            </div>
          </div>

          <NomasCard className="bg-content3">
            <NomasCardBody>
              <div className="flex gap-4 items-center">
                <ButtonSelectTokenWithdraw
                  token={tokenManager.getTokenById(swapFormik.values.tokenOut)}
                  chainMetadata={tokenOutChainMetadata}
                  onSelect={() => {
                    dispatch(setSwapPage(SwapPageState.SelectToken));
                  }}
                />

                <NomasNumberTransparentInput
                  value={swapFormik.values.amountIn}
                  onValueChange={(value) => {
                    swapFormik.setFieldValue('amountIn', value);
                  }}
                  onFocus={() => {
                    swapFormik.setFieldValue('tokenInFocused', true);
                  }}
                  isRequired
                  onBlur={() => {
                    swapFormik.setFieldValue('tokenInFocused', false);
                    swapFormik.setFieldTouched('amountIn');
                  }}
                  isInvalid={
                    !!(
                      swapFormik.touched.amountIn && swapFormik.errors.amountIn
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
      <NomasCard className="bg-content2">
        <NomasCardBody>
          <p className="">To</p>
          <Input
            endContent={<ClipboardIcon />}
            placeholder="Enter address, domain name or Telegram user"
            type="text"
            classNames={{
              inputWrapper:
                'bg-content3-foreground data-[hover=true]:bg-content3-foreground group-data-[focus=true]:bg-content3-foreground',
              innerWrapper: 'bg-content3-foreground',
            }}
          />
          <NomasDivider className="my-2" />
          <p className="">Comment or memo</p>
          <Textarea
            isClearable
            placeholder="Enter comment"
            onClear={() => console.log('textarea cleared')}
            classNames={{
              inputWrapper:
                'bg-content3-foreground data-[hover=true]:bg-content3-foreground group-data-[focus=true]:bg-content3-foreground',
              innerWrapper: 'bg-content3-foreground',
            }}
          />
        </NomasCardBody>
      </NomasCard>
      <NomasDivider className="my-3" />
      <NomasButton
        className="py-6"
        onPress={() => {
          console.log('Withdraw');
        }}
      >
        Next
      </NomasButton>
    </>
  );
};
