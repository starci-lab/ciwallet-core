import useSWR from 'swr';
import {
  NomasButton,
  NomasCard,
  NomasCardBody,
  NomasCardHeader,
} from '../../../extends';
import { InitWithdraw } from './InitWithdraw';
import { ProcessTransaction } from './ProcessTransaction';
import { ResultTransaction } from './ResultTransaction';
import { SignTransaction } from './SignTransaction';
import { useSwapFormik } from '@/nomas/hooks';
import { useAppDispatch, useAppSelector } from '@/nomas/redux';
import { useBalance } from '@ciwallet-sdk/hooks';

export const WithdrawPage = () => {
  const dispatch = useAppDispatch();
  const chainManager = useAppSelector((state) => state.chain.manager);
  const withdrawChainId = useAppSelector((state) => state.withdraw.chainId);
  const tokenManager = useAppSelector((state) => state.token.manager);
  const swapFormik = useSwapFormik();
  const { handle } = useBalance();
  const network = useAppSelector((state) => state.base.network);
  

  return (
    <>
      <NomasCard asCore className="">
        <NomasCardHeader
          title="Withdraw"
          showBackButton
          onBackButtonPress={() => {
            console.log('Back');
          }}
        />
        <NomasCardBody>
          <InitWithdraw />
          {/* <SignTransaction /> */}
          {/* <ProcessTransaction /> */}

          {/* <ResultTransaction /> */}
        </NomasCardBody>
      </NomasCard>
    </>
  );
};
