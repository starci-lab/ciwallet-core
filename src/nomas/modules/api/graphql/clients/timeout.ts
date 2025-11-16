import { publicEnv } from "@/modules/env/public"
import { ApolloLink, Observable } from "@apollo/client"

// Custom timeout link
export const createTimeoutLink = () => {
    const timeoutMs = publicEnv().graphql.timeout
    return new ApolloLink((operation, forward) => {
        return new Observable((observer) => {
            const timer = setTimeout(() => {
                observer.error(
                    new Error(`GraphQL request timed out after ${timeoutMs}ms`)
                )
            }, timeoutMs)
  
            const sub = forward(operation).subscribe({
                next: (value) => observer.next(value),
                error: (err) => {
                    clearTimeout(timer)
                    observer.error(err)
                },
                complete: () => {
                    clearTimeout(timer)
                    observer.complete()
                },
            })
  
            return () => {
                clearTimeout(timer)
                sub.unsubscribe()
            }
        })
    })
}