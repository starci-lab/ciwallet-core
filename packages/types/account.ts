import type { ChainId, Network } from "./chain"

export interface Account {
  accountAddress: string;
  name?: string;
  publicKey?: string;
  chainId: ChainId;
  network?: Network;
  avatarUrl?: string;
}
