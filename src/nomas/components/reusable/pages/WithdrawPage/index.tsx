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
import {
  useAppDispatch,
  useAppSelector,
  WithdrawPageState,
} from '@/nomas/redux';
import { useBalance } from '@ciwallet-sdk/hooks';

export const WithdrawPage = () => {
  const dispatch = useAppDispatch();
  const withdrawPage = useAppSelector((state) => state.withdraw.withdrawPage);

  const pageRender = () => {
    switch (withdrawPage) {
      case WithdrawPageState.InitWithdraw:
        return <InitWithdraw />;
      case WithdrawPageState.SignTransaction:
        return <SignTransaction />;
      case WithdrawPageState.ProcessTransaction:
        return <ProcessTransaction />;
      case WithdrawPageState.ResultTransaction:
        return <ResultTransaction />;
    }
  };

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
          {pageRender()}
          {/* <InitWithdraw /> */}
          {/* <SignTransaction /> */}
          {/* <ProcessTransaction /> */}

          {/* <ResultTransaction /> */}
        </NomasCardBody>
      </NomasCard>
    </>
  );
};
