import { HttpLink } from "@apollo/client"
import { envConfig } from "@/nomas/env"

export const createHttpLink = (
    withCredentials = false,
    headers: Record<string, string> = {}
) => {
    return new HttpLink({
        uri: `${envConfig().nomasServer.endpoint}`,
        credentials: withCredentials ? "include" : "same-origin",
        headers,
    })
}
