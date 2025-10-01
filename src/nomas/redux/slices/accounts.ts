import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AccountManager } from '@ciwallet-sdk/classes';
import { ChainId, type Account, Network } from '@ciwallet-sdk/types';

export interface AccountSlice {
  manager: AccountManager;
}

const initialState: AccountSlice = {
  manager: new AccountManager({
    [ChainId.Solana]: {
      [Network.Mainnet]: {
        address: '3xaKeNNV4gdAs6ovtjrxtfUqc5bG2q6hbokP8qM3ToQu',
        chainId: ChainId.Solana,
        name: 'Default Solana Account',
        publicKey: '3xaKeNNV4gdAs6ovtjrxtfUqc5bG2q6hbokP8qM3ToQu',
      },
      [Network.Testnet]: {
        address: '3xaKeNNV4gdAs6ovtjrxtfUqc5bG2q6hbokP8qM3ToQu',
        chainId: ChainId.Solana,
        name: 'Default Solana Account',
        publicKey: '3xaKeNNV4gdAs6ovtjrxtfUqc5bG2q6hbokP8qM3ToQu',
      },
    },
    [ChainId.Monad]: {
      [Network.Mainnet]: {
        address: '0xA7C1d79C7848c019bCb669f1649459bE9d076DA3',
        chainId: ChainId.Monad,
        name: 'Default Monad Account',
        publicKey: '0xA7C1d79C7848c019bCb669f1649459bE9d076DA3',
      },
      [Network.Testnet]: {
        address: '0xA7C1d79C7848c019bCb669f1649459bE9d076DA3',
        chainId: ChainId.Monad,
        name: 'Default Monad Account',
        publicKey: '0xA7C1d79C7848c019bCb669f1649459bE9d076DA3',
      },
    },
  }),
};

export const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    // Replace the whole manager (e.g., after deserializing from storage)
    setAccountManager: (state, action: PayloadAction<AccountManager>) => {
      state.manager = action.payload;
    },

    // Set/replace the single account for a chain+network
    setAccount: (
      state,
      action: PayloadAction<{ account: Account; network: Network }>,
    ) => {
      const { account, network } = action.payload;
      state.manager.setAccount(account, network);
    },

    // Remove the single account for chain+network
    removeAccount: (
      state,
      action: PayloadAction<{ chainId: ChainId; network: Network }>,
    ) => {
      const { chainId, network } = action.payload;
      state.manager.removeAccount(chainId, network);
    },

    // Optional helpers

    // Update just the name of an existing account (no-op if missing)
    renameAccount: (
      state,
      action: PayloadAction<{
        chainId: ChainId;
        network: Network;
        name: string;
      }>,
    ) => {
      const { chainId, network, name } = action.payload;
      const acc = state.manager.getAccount(chainId, network);
      if (acc) {
        state.manager.setAccount({ ...acc, name }, network);
      }
    },

    // Bulk set many accounts at once (upsert behavior)
    setManyAccounts: (
      state,
      action: PayloadAction<Array<{ account: Account; network: Network }>>,
    ) => {
      for (const { account, network } of action.payload) {
        state.manager.setAccount(account, network);
      }
    },
  },
});

export const accountReducer = accountSlice.reducer;
export const {
  setAccountManager,
  setAccount,
  removeAccount,
  renameAccount,
  setManyAccounts,
} = accountSlice.actions;
