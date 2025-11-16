import { useRouter } from "next/navigation"
import { publicEnv } from "@/modules/env"
import { ApiVersion } from "../types"
import { SearchParamKey } from "@/modules/query"

export class ApiAuthRedirect {
    private readonly version: ApiVersion
    private readonly baseUrl: string
    constructor(version: ApiVersion = ApiVersion.V1) {
        this.version = version
        this.baseUrl = `${publicEnv().apiBaseUrl.http}/${this.version}`
    }
    // redirect to google auth
    public redirectGoogle(router: ReturnType<typeof useRouter>) {
        const url = new URL(`${this.baseUrl}/auth/google/redirect`)
        url.searchParams.set(SearchParamKey.DestinationUrl, `${window.location.origin}/totp`)
        router.replace(url.toString())
    }
}