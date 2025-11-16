import { publicEnv } from "@/modules/env"
import { RetryLink } from "@apollo/client/link/retry"

// retry link
export const createRetryLink = () => {
    return new RetryLink({
        delay: {
            initial: publicEnv().graphql.initialRetryDelay,
            max: publicEnv().graphql.maxRetryDelay,
            jitter: true
        },
        attempts: {
            max: publicEnv().graphql.maxRetry,
            retryIf: (error) => {
                return !!error
            }
        }
    })
}