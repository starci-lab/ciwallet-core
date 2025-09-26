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

export const WithdrawPage = () => {
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
          {/* <InitWithdraw /> */}
          {/* <SignTransaction /> */}
          {/* <ProcessTransaction /> */}

          <ResultTransaction />
        </NomasCardBody>
      </NomasCard>
    </>
  );
};
