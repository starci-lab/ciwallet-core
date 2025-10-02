import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ChainId, TokenId, TokenType } from '@ciwallet-sdk/types';
import { ERC20Contract } from '@ciwallet-sdk/contracts';
import {
  setWithdrawPage,
  useAppDispatch,
  useAppSelector,
  WithdrawPageState,
} from '@/nomas/redux';
import {
  useWalletKit,
  type SignAndSendTransactionResponse,
} from '@ciwallet-sdk/providers';
import { ethers } from 'ethers';
import { AggregatorId, type ProtocolData } from '@ciwallet-sdk/classes';
import type { EvmSerializedTx } from '@ciwallet-sdk/classes';
import { useBatchAggregatorSwrMutations } from '../mixin';
import SuperJSON from 'superjson';
import { toRaw } from '@ciwallet-sdk/utils';
import { useContext } from 'react';
import { FormikContext } from './FormikProvider';
import { useNonce, useTransfer } from '@ciwallet-sdk/hooks';
import { erc20Abi } from '@ciwallet-sdk/misc';

type Result = {
  status: boolean;
  data?: SignAndSendTransactionResponse;
};

export interface WithdrawFormikValues {
  balance: number;
  amount: string;
  tokenId: TokenId;
  chainId: ChainId;
  walletAddress: string;
  toAddress: string;
  feeOption: 'low' | 'medium' | 'high';
  comment: string;
  fee?: number;
  result: {
    status: boolean;
    data: SignAndSendTransactionResponse | undefined;
  } | null;
}

const withdrawValidationSchema = Yup.object({
  balance: Yup.number()
    .min(0, 'Balance must be more or equal to 0')
    .required('Balance is required'),
  amount: Yup.number()
    .moreThan(0, 'Amount must be > 0')
    .required('Amount is required')
    .test(
      'amount-less-than-balance',
      'Amount must be less than or equal to balance',
      function (value) {
        const { balance } = this.parent;
        return value <= balance;
      },
    ),
  toAddress: Yup.string()
    .uppercase()
    .required('To Address is required')
    .test('is-valid-address', 'To Address is not valid', function (value) {
      if (!value || value === '') return false;
      return true;
    }),
  walletAddress: Yup.string().required('Wallet Address is required'),
  tokenId: Yup.string().required('Token is required'),
  chainId: Yup.string().required('Chain is required'),
});

export const useWithdrawFormik = () => {
  const context = useContext(FormikContext);
  if (!context) {
    throw new Error('useWithdrawFormik must be used within a FormikProvider');
  }
  return context.withdrawFormik;
};

export const useWithdrawFormikCore = () => {
  const network = useAppSelector((state) => state.base.network);
  const tokenManager = useAppSelector((state) => state.token.manager);
  const { adapter } = useWalletKit();
  const { handle } = useTransfer();
  const { nonceHandle } = useNonce();
  const dispatch = useAppDispatch();

  return useFormik<WithdrawFormikValues>({
    initialValues: {
      balance: 0,
      amount: '0',
      tokenId: TokenId.MonadTestnetMon,
      chainId: ChainId.Monad,
      walletAddress: '',
      toAddress: '',
      feeOption: 'low',
      comment: '',
      fee: 0.001,
      result: null,
    },
    validationSchema: withdrawValidationSchema,
    onSubmit: async (values, { setFieldValue }) => {
      console.log('withdrawFormik::onSubmit::');
      console.log('Values:', values);
      const token = tokenManager.getTokenById(values.tokenId);

      switch (values.chainId) {
        case ChainId.Monad: {
          const nonceValue = await nonceHandle({
            address: values.walletAddress,
            chainId: values.chainId,
            network,
          });
          console.log('nonce in formik:', nonceValue);


          if (!token) {
            throw new Error('Token not found');
          }
          if (!handle) {
            throw new Error('Transfer handler not found');
          }
          if (!adapter) {
            throw new Error('Wallet adapter not found');
          }

          let result: Result = {
            status: false,
            data: undefined,
          };

          try {
            switch (token.type) {
              // Send native token (ETH, MON, etc.)
              case TokenType.Native: {
                const tx = {
                  to: values.toAddress,
                  value: ethers.parseUnits(
                    values.amount.toString(),
                    token.decimals ?? 18,
                  ),
                  chainId: BigInt(10143),
                  maxPriorityFeePerGas: ethers.parseUnits(
                    '0.000000001',
                    'gwei',
                  ),
                  maxFeePerGas: ethers.parseUnits('67.5', 'gwei'),
                  gasLimit: BigInt(21000),
                  nonce: nonceValue,
                };

                // Serialize & send via adapter
                const transaction =
                  ethers.Transaction.from(tx).unsignedSerialized;
                const response = await adapter.signAndSendTransaction?.({
                  transaction,
                  chainId: values.chainId,
                  network,
                });

                console.log('response::', response);

                result.data = response;
                if (response) {
                  result.status = true;
                }

                await setFieldValue('result', result);
                break;
              }
              // ERC20 transfer
              case TokenType.Stable: {
                if (!token.address) {
                  throw new Error('Token address not found');
                }

                console.log('token::', token);
                const erc20Iface = new ethers.Interface(erc20Abi);

                const data = erc20Iface.encodeFunctionData('transfer', [
                  values.toAddress,
                  ethers.parseUnits(
                    values.amount.toString(),
                    token.decimals ?? 18,
                  ),
                ]);

                const tx = {
                  to: token.address,
                  data,
                  value: 0n,
                  chainId: BigInt(10143),
                  maxPriorityFeePerGas: ethers.parseUnits(
                    '0.000000001',
                    'gwei',
                  ),
                  maxFeePerGas: ethers.parseUnits('67.5', 'gwei'),
                  gasLimit: BigInt(100000),
                  nonce: nonceValue,
                };

                const transaction =
                  ethers.Transaction.from(tx).unsignedSerialized;
                const response = await adapter.signAndSendTransaction?.({
                  transaction,
                  chainId: values.chainId,
                  network,
                });

                console.log('ERC20 transfer response::', response);

                result.data = response;
                if (response) {
                  result.status = true;
                }

                await setFieldValue('result', result);
                break;
              }
              default:
                throw new Error(`Unsupported token type: ${token.type}`);
            }
          } catch (error) {
            console.error('Transfer error:', error);
            result.status = false;
            result.data = undefined;
            await setFieldValue('result', result);
          }

          break;
        }
        case ChainId.Solana: {
          const token = tokenManager.getTokenById(values.tokenId);
          if (!token) {
            throw new Error('Token not found');
          }
          if (!handle) {
            throw new Error('Transfer handler not found');
          }
          if (!adapter) {
            throw new Error('Wallet adapter not found');
          }
          let result: Result = {
            status: false,
            data: undefined,
          };

          try {
            const response = await handle({
              chainId: values.chainId,
              network,
              toAddress: values.toAddress,
              tokenAddress: token.address ?? '',
              amount: Number(values.amount),
            });
            console.log('response::', response);
            // result.data = response;

            if (response) {
              result.data = {
                signature: response.txHash,
                fee: BigInt(0),
              };
              result.status = true;
            }
            await setFieldValue('result', result);
          } catch (error) {
            console.error('Transfer error:', error);
            result.status = false;
            result.data = undefined;
            await setFieldValue('result', result);
          }
          break;
        }
        default: {
          throw new Error(`Chain ${values.chainId} is not supported`);
        }
      }
      dispatch(setWithdrawPage(WithdrawPageState.ResultTransaction));
    },
  });
};
