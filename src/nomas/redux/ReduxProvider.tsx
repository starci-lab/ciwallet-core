import { Provider } from "react-redux"
import { persistor, store } from "./store"
import { PersistGate } from "redux-persist/integration/react"
import { useEffect } from "react"
import { loadUserFromStorage } from "./slices"
import { useAppDispatch } from "./hooks"

const InitializeApp = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(loadUserFromStorage())
    }, [dispatch])

    return <>{children}</>
}

export const ReduxProvider = ({ children, loading }: { children: React.ReactNode, loading: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <PersistGate loading={loading} persistor={persistor}>
                <InitializeApp>{children}</InitializeApp>
            </PersistGate>
        </Provider>
    )
}
