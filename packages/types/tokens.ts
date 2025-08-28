export enum TokenId {
    MonadTestnetMon = "monad_testnet_mon",
    MonadTestnetWmon = "monad_testnet_wmon",
    MonadTestnetUsdc = "monad_testnet_usdc"
}

export enum TokenType {
    Native = "native",
    Stable = "stable",
    Wrapped = "wrapped",
}

export interface Token {
    tokenId: TokenId
    address?: string
    decimals: number
    symbol: string
    name: string
    iconUrl: string
    type: TokenType
    verified: boolean
}