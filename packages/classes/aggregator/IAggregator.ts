export interface IAggregator {
    quote: (params: QuoteParams) => Promise<QuoteResponse>
}

export interface QuoteParams {
    fromToken: string
    toToken: string
    amount: number
    exactIn: boolean
}

export interface QuoteResponse {
    amount: number
    fromAmount: number
    toAmount: number
}