export interface GraphQLResponse<TData = undefined> {
    success: boolean;
    message: string;
    error?: string;
    data?: TData;
}

export enum GraphQLHeadersKey {
    TOTP = "X-TOTP",
}

export type GraphQLHeaders = Record<GraphQLHeadersKey, string>

export interface MutationParams<TMutation, TRequest = undefined> {
    mutation?: TMutation
    request?: TRequest
    headers?: GraphQLHeaders
}

export interface QueryParams<TQuery, TRequest = undefined> {
    query?: TQuery
    request?: TRequest
    headers?: GraphQLHeaders
}

export interface QueryVariables<TRequest> {
    request: TRequest
}

export interface MutationVariables<TRequest> {
    request: TRequest
}

export interface QueryVariables<TRequest> {
    request: TRequest
}