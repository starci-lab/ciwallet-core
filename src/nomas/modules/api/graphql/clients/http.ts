import { HttpLink } from "@apollo/client"

export const createHttpLink = (
    withCredentials = false, 
    headers: Record<string, string> = {}
) => {
    return new HttpLink({
        uri: `${"abc"}`,
        credentials: withCredentials ? "include" : "same-origin",
        headers,
    })
}