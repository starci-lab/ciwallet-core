import { HttpLink } from "@apollo/client"
import { publicEnv } from "@/modules/env"

export const createHttpLink = (withCredentials = false, headers: Record<string, string> = {}) => {
    return new HttpLink({
        uri: `${publicEnv().apiBaseUrl.graphql}`,
        credentials: withCredentials ? "include" : "same-origin",
        headers,
    })
}