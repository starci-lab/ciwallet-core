import { envConfig } from "@/nomas/env"
import { RetryLink } from "@apollo/client/link/retry"

// retry link
export const createRetryLink = () => {
    return new RetryLink({
        delay: {
            initial: envConfig().nomasServer.initialRetryDelay,
            max: envConfig().nomasServer.maxRetryDelay,
            jitter: true,
        },
        attempts: {
            max: envConfig().nomasServer.maxRetry,
            retryIf: (error) => {
                return !!error
            },
        },
    })
}
