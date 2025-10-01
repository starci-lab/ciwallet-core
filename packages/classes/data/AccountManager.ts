import type { ChainId, Network, Account } from '@ciwallet-sdk/types';

export type Accounts = Partial<
  Record<ChainId, Partial<Record<Network, Account>>>
>;

export class AccountManager {
  private accounts: Accounts = {};

  constructor(initialAccounts: Accounts = {}) {
    this.accounts = initialAccounts;
  }

  /** Create or replace the (only) account for chain+network */
  public setAccount(account: Account, network: Network): void {
    const { chainId } = account;
    if (!this.accounts[chainId]) this.accounts[chainId] = {};
    this.accounts[chainId]![network] = account; // always replace
  }

  /** Remove the single account for chain+network */
  public removeAccount(chainId: ChainId, network: Network): void {
    if (!this.accounts[chainId]) return;
    delete this.accounts[chainId]![network];
    // cleanup empty bucket
    if (
      this.accounts[chainId] &&
      Object.keys(this.accounts[chainId]!).length === 0
    ) {
      delete this.accounts[chainId];
    }
  }

  /** Get the single account for chain+network */
  public getAccount(chainId: ChainId, network: Network): Account | undefined {
    return this.accounts[chainId]?.[network];
  }

  /** Check existence quickly */
  public hasAccount(chainId: ChainId, network: Network): boolean {
    return !!this.getAccount(chainId, network);
  }

  /** Return plain object for storage/serialization */
  public toObject(): Accounts {
    return this.accounts;
  }

  /** Optional: list all accounts (flattened) */
  public listAll(): Array<{
    chainId: ChainId;
    network: Network;
    account: Account;
  }> {
    const out: Array<{ chainId: ChainId; network: Network; account: Account }> =
      [];
    for (const chainId of Object.keys(this.accounts) as Array<ChainId>) {
      const nets = this.accounts[chainId]!;
      for (const network of Object.keys(nets) as Array<Network>) {
        const account = nets[network]!;
        out.push({ chainId, network, account });
      }
    }
    return out;
  }
}
