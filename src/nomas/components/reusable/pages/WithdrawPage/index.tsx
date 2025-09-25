import { NomasCard, NomasCardBody, NomasCardHeader } from '../../../extends';
import { InitWithdraw } from './InitWithdraw';
import { SignTransaction } from './SignTransation';

export const WithdrawPage = () => {
  return (
    <>
      <NomasCard asCore className="bg-amber-400">
        <NomasCardHeader
          title="Withdraw"
          showBackButton
          onBackButtonPress={() => {
            console.log('Back');
          }}
        />
        <NomasCardBody>
          {/* <InitWithdraw /> */}
          <SignTransaction />
        </NomasCardBody>
      </NomasCard>
    </>
  );
};
