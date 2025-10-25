import { configureStore } from "@reduxjs/toolkit"
import {
    statelessReducer,
    persistsReducer,
    listenerMiddleware
} from "./slices"
import { persistStore } from "redux-persist"

export const store = configureStore({
    reducer: {
        stateless: statelessReducer,
        persists: persistsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).prepend(listenerMiddleware.middleware),
})
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
