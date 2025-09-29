import { EvmProvider } from '@ciwallet-sdk/classes';
import { Platform, type BaseParams } from '@ciwallet-sdk/types';
import { chainKeyToPlatform } from '@ciwallet-sdk/utils';
import { useWalletKit } from '@ciwallet-sdk/providers';
import { JsonRpcProvider } from 'ethers';

export interface UseGetNonceParams extends BaseParams {
  // to address in solana, we use ata
  address: string;
}
export const useNonce = () => {
  const { adapter } = useWalletKit();
  const nonceHandle = ({ address, chainId, network }: UseGetNonceParams) => {
    switch (chainKeyToPlatform(chainId)) {
      case Platform.Evm:
        const rpc = new JsonRpcProvider('https://testnet-rpc.monad.xyz');
        return rpc.getTransactionCount(address, 'pending');
      case Platform.Solana:
        throw new Error('Solana is not supported');
      default:
        throw new Error(`Chain ${chainId} is not supported`);
    }
  };

  return {
    nonceHandle,
  };
};
