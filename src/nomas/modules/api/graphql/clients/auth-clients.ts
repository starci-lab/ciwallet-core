import {
    ApolloClient,
    ApolloLink,
    InMemoryCache,
    Observable,
} from "@apollo/client"
import {
    CombinedGraphQLErrors,
    CombinedProtocolErrors,
} from "@apollo/client/errors"
import { ErrorLink } from "@apollo/client/link/error"
import { mutationRefresh } from "./mutations"
import { createTimeoutLink } from "./timeout"
import { createRetryLink } from "./retry"
import { createHttpLink } from "./http"
import { SessionStorage, SessionStorageKey } from "@/nomas/modules/storages"

const sessionStorage = new SessionStorage()

// Modern auth link using ApolloLink (setContext is deprecated)
export const createAccessTokenAuthLink = () =>
    new ApolloLink((operation, forward) => {
        const accessToken = sessionStorage.getItem<string>(
            SessionStorageKey.AccessToken
        )
        // Add Authorization header if accessToken exists
        if (accessToken) {
            operation.setContext(({ headers = {} }) => ({
                headers: {
                    ...headers,
                    authorization: `Bearer ${accessToken}`,
                },
            }))
        }
        // Forward the operation down the link chain
        return forward(operation)
    })

export const createErrorLink = (withRetry = true) =>
    new ErrorLink(({ error, operation, forward }) => {
    // if graphql error, check if it is unauthorized
        if (CombinedGraphQLErrors.is(error)) {
            for (const gqlErr of error.errors) {
                if (
                    gqlErr.message === "Unauthorized" ||
          gqlErr.extensions?.code === "UNAUTHENTICATED"
                ) {
                    console.log("[GraphQL error]: Unauthorized")
                    if (withRetry) {
                        handleTokenRefreshAndRetry(operation, forward)
                    }
                    return
                }
            }
        }
        // if protocol error, log the error
        if (CombinedProtocolErrors.is(error)) {
            error.errors.forEach(({ message, extensions }) =>
                console.log(
                    `[Protocol error]: Message: ${message}, Extensions: ${JSON.stringify(
                        extensions
                    )}`
                )
            )
            return
        }
        // if network error, log the error
        console.error(`[Network error]: ${error.message}`)
    })

/**
 * Handles token refresh flow and retries the failed operation.
 */
const handleTokenRefreshAndRetry = (
    operation: ApolloLink.Operation,
    forward: ApolloLink.ForwardFunction
) => {
    return new Observable((observer) => {
        ;(async () => {
            try {
                // Call refresh mutation
                const refreshRes = await mutationRefresh({})
                const accessToken = refreshRes?.data?.refresh?.data?.accessToken
                if (!accessToken) {
                    throw new Error("Failed to refresh token")
                }
                // Save access token
                sessionStorage.setItem(SessionStorageKey.AccessToken, accessToken)
                // Update the original operation headers with new token
                operation.setContext(({ headers = {} }) => ({
                    headers: {
                        ...headers,
                        authorization: `Bearer ${accessToken}`,
                    },
                }))
                // Retry the failed operation
                forward(operation).subscribe({
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                })
            } catch (refreshError) {
                console.error("[Refresh token failed]", refreshError)
                observer.error(refreshError)
            }
        })()
    })
}

export const authClient = new ApolloClient({
    // Combine the 4 links
    link: ApolloLink.from([
        createRetryLink(),
        createAccessTokenAuthLink(),
        createErrorLink(),
        createTimeoutLink(),
        createHttpLink(),
    ]),
    cache: new InMemoryCache(),
})

export const noCacheAuthClientWithoutRetry = new ApolloClient({
    // Combine the 4 links
    link: ApolloLink.from([
        createRetryLink(),
        createAccessTokenAuthLink(),
        createErrorLink(false),
        createTimeoutLink(),
        createHttpLink(),
    ]),
    cache: new InMemoryCache(),
})

export const noCacheAuthClient = new ApolloClient({
    // Combine the 4 links
    link: ApolloLink.from([
        createRetryLink(),
        createAccessTokenAuthLink(),
        createErrorLink(),
        createTimeoutLink(),
        createHttpLink(),
    ]),
    cache: new InMemoryCache(),
})

export const noCacheCredentialAuthClient = new ApolloClient({
    // Combine the 4 links
    link: ApolloLink.from([
        createRetryLink(),
        createAccessTokenAuthLink(),
        createErrorLink(),
        createTimeoutLink(),
        createHttpLink(true),
    ]),
    cache: new InMemoryCache(),
})

export const createNoCacheCredentialAuthClientWithHeaders = (
    headers: Record<string, string>
) =>
    new ApolloClient({
    // Combine the 4 links
        link: ApolloLink.from([
            createRetryLink(),
            createAccessTokenAuthLink(),
            createErrorLink(),
            createTimeoutLink(),
            createHttpLink(true, headers),
        ]),
        cache: new InMemoryCache(),
    })
