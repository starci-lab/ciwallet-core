import type { IAggregator, QuoteParams, QuoteResponse } from "./IAggregator"
import axios, { Axios } from "axios"

export interface CiAggregatorParams {
    url?: string
}

export class CiAggregator implements IAggregator {
    private readonly axiosInstance: Axios
    constructor(
        private readonly params: CiAggregatorParams
    ) {
        this.axiosInstance = axios.create({
            baseURL: this.params.url ?? "http://localhost:3000",
        })
    }

    async quote(params: QuoteParams): Promise<QuoteResponse> {
        console.log(params)
        const response = await this.axiosInstance.get("/quote")
        return response.data
    }
}