import { configureStore } from '@reduxjs/toolkit';
import {
  chainReducer,
  tokenReducer,
  swapReducer,
  modalsReducer,
  baseReducer,
  pagesReducer,
  aggregatorReducer,
  protocolReducer,
  potfolioReducer,
  withdrawReducer,
  accountReducer,
} from './slices';

export const store = configureStore({
  reducer: {
    swap: swapReducer,
    token: tokenReducer,
    chain: chainReducer,
    modals: modalsReducer,
    base: baseReducer,
    pages: pagesReducer,
    aggregator: aggregatorReducer,
    potfolio: potfolioReducer,
    protocol: protocolReducer,
    withdraw: withdrawReducer,
    accounts: accountReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
