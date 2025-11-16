import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client"
import { createRetryLink } from "./retry"
import { createTimeoutLink } from "./timeout"
import { createHttpLink } from "./http"
import { defaultOptions } from "./options"

// no cache client
export const noCacheClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([createRetryLink(), createTimeoutLink(), createHttpLink()]),
    defaultOptions: defaultOptions,
})

export const noCacheCredentialClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from(
        [
            createRetryLink(), 
            createTimeoutLink(), 
            createHttpLink(true)
        ]),
    defaultOptions: defaultOptions,
})

// client
export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([createRetryLink(), createTimeoutLink(), createHttpLink()]),
})