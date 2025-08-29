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

    async quote(
        params: QuoteParams
    ): Promise<QuoteResponse> {
        const response = await this.axiosInstance.get("/quote", {
            params: {
                tokenIn: params.fromToken,
                tokenOut: params.toToken,
                amount: params.amount,
                exactIn: params.exactIn,
            },
            signal: params.signal
        })
        return response.data.data.data
    }
}