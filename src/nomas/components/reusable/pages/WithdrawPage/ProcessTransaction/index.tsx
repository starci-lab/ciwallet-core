import {
  NomasButton,
  NomasCard,
  NomasCardBody,
  NomasDivider,
} from '../../../../extends';
import { useAppSelector, useAppDispatch } from '@/nomas/redux';
import { useBalance } from '@ciwallet-sdk/hooks';
import { SpinnerGapIcon } from '@phosphor-icons/react';
import { useSwapFormik } from '@/nomas/hooks/singleton/formiks/useSwapFormik';

export const ProcessTransaction = () => {
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
      <NomasCard className="bg-content3 border-1 border-foreground-700">
        <NomasCardBody>
          <NomasCard className="bg-content3 text-foreground-700">
            <NomasCardBody>
              <div className="flex flex-col items-center justify-center">
                <p className='text-neutral-300 text-xl'>Sending USDT</p>
                <SpinnerGapIcon className="h-13 w-13 animate-spin" />

                <p className='text-neutral-300 text-2xl'>100.22</p>
                <p className='text-neutral-300'>$100.00</p>
              </div>
            </NomasCardBody>
          </NomasCard>
        </NomasCardBody>
      </NomasCard>
      <NomasDivider className="my-3" />
      <NomasButton
        className="py-6 border-1 border-foreground-700"
        onPress={() => {
          console.log('Withdraw');
        }}
      >
        Cancel
      </NomasButton>
    </>
  );
};
