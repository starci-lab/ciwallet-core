import type { ChainId, Network } from './chain';

export interface Account {
  address: string;
  name?: string;
  publicKey?: string;
  chainId: ChainId;
  network?: Network;
}
