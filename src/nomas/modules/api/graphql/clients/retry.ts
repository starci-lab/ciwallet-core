
import { RetryLink } from "@apollo/client/link/retry"

// retry link
export const createRetryLink = () => {
    return new RetryLink({
        delay: {
            initial: 1000,
            max: 10000,
            jitter: true
        },
        attempts: {
            max: 3,
            retryIf: (error) => {
                return !!error
            }
        }
    })
}
