import {
  NomasAvatar,
  NomasCard,
  NomasCardBody,
  NomasCardHeader,
  NomasDivider,
} from '@/nomas/components/extends';
import { ClockIcon } from '@phosphor-icons/react';

export const TransactionsPage = () => {
  const transactions = [
    {
      id: 1,
      type: 'Deposit',
      amount: '0.5',
      token: 'Bitcoin',
      symbol: 'BTC',
      date: '26/09/2025',
      amountInUSD: '931,30',
      address: '0x9d07...6DA3',
    },
    {
      id: 2,
      type: 'Withdraw',
      amount: '1.2',
      token: 'Ethereum',
      symbol: 'ETH',
      date: '25/09/2025',
      amountInUSD: '931,30',
      address: '0x9d07...6DA3',
    },
  ];

  return (
    <>
      <NomasCard asCore className="bg-content2">
        <NomasCardHeader
          title="Transactions"
          showBackButton
          onBackButtonPress={() => {
            console.log('Back');
          }}
        />
        <NomasCardBody>
          <div className="flex flex-col bg-content2 gap-0 p-2 rounded-lg">
            {transactions.map((tx) => (
              <NomasCard radius="none" className="bg-content2">
                <NomasCardBody className="">
                  <div className="flex flex-row items-center gap-1 text-tiny text-foreground-500 mb-1">
                    <ClockIcon className="w-4 h-4" weight="fill" />
                    <span className="">{tx.date}</span>
                  </div>

                  <div className="mx-2 mt-2">
                    <div className="text-sm font-medium">{tx.type}</div>
                    <NomasDivider
                      className="my-2 bg-foreground-800"
                      orientation="horizontal"
                    />

                    <div className="flex flex-row items-center justify-between gap-2">
                      <div className="flex flex-row items-start gap-1">
                        <NomasAvatar src="" />
                        <div className="flex flex-col text-xs text-foreground-500">
                          <span>{tx.token}</span>
                          <span className="">{tx.address}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-0">
                        <div
                          className={
                            `text-sm font-medium gap-1 ` +
                            (tx.type === 'Deposit'
                              ? 'text-green-500'
                              : 'text-red-500')
                          }
                        >
                          <span>{tx.type === 'Deposit' ? '+' : '-'}</span>
                          <span>{tx.amount}</span>
                          <span>{tx.symbol}</span>
                        </div>
                        <span className="text-xs text-foreground-500">
                          ${tx.amountInUSD}
                        </span>
                      </div>
                    </div>
                  </div>
                </NomasCardBody>
              </NomasCard>
            ))}
          </div>
        </NomasCardBody>
      </NomasCard>
    </>
  );
};
