// an interface to do the data action

import { ChainId, type BaseParams } from '@ciwallet-sdk/types';
// when any wallet builder is created, it will be passed to the wallet kit provider

export interface Aggregator {
  url: string;
}

export interface Aggregators {
  ciAggregator: Aggregator;
}

export interface Chain {
  // chain id
  chainId: ChainId;
  // array of rpc urls
  rpcs: Array<string>;
}

export interface IWalletAdapter {
  // chain info
  chains: Array<Chain>;
  // aggregator urls
  aggregators?: Aggregators;
  // whenever in-app require sign message, it will be passed to the storage provider
  signMessage?: (params: SignMessageParams) => Promise<SignMessageResponse>;
  // whenever in-app require get key pair, it will be passed to the storage provider
  getKeyPair?: (params: GetKeyPairParams) => Promise<GetKeyPairResponse>;
  // get accounts
  getAccounts?: (params: GetAccountsParams) => Promise<GetAccountsResponse>;
  // on connect (optional)
  onConnect?: (params: OnConnectParams) => Promise<void>;
  // on disconnect (optional)
  onDisconnect?: (params: OnDisconnectParams) => Promise<void>;
  // sign transaction
  signTransaction?: (
    params: SignTransactionParams,
  ) => Promise<SignTransactionResponse>;
  // sign and send transaction
  signAndSendTransaction?: (
    params: SignAndSendTransactionParams,
  ) => Promise<SignAndSendTransactionResponse>;
}

export interface GetChainInfoParams extends BaseParams {
  // chain id
  chainId: ChainId;
}

export interface SignMessageParams extends BaseParams {
  // message to sign
  message: string;
}

export interface SignMessageResponse {
  // signature of the message
  signature: string;
}

export interface GetKeyPairParams extends BaseParams {
  // address of keypairs
  accountAddress: string;
}

export interface GetKeyPairResponse {
  // public key
  publicKey: string;
  // private key
  privateKey: string;
}

export type GetAccountsParams = BaseParams;

export interface GetAccountsResponse {
  // accounts
  accounts: Array<string>;
  // selected account id
  selectedAccountId: string;
}

export interface OnConnectParams extends BaseParams {
  // account address
  accountAddress: string;
}

export interface OnDisconnectParams extends BaseParams {
  // account address
  accountAddress: string;
}

export interface SignTransactionParams extends BaseParams {
  // transaction to sign
  transaction: string;
}

export interface SignTransactionResponse {
  // signature of the transaction
  signature: string;
}

export interface SignAndSendTransactionParams extends BaseParams {
  // transaction to sign
  transaction: string;
}

export interface SignAndSendTransactionResponse {
  // signature of the transaction
  signature: string;
  fee: bigint | undefined;
}
