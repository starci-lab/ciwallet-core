export interface IAction {
    // transfer a token to a destination address
    // in Solana, we use ATA instead of address
    transfer: (params: TransferParams) => Promise<TransferResponse>
    // approve a transfer in case of ERC20
    approve?: (params: ApproveParams) => Promise<ApproveResponse>
}

export interface TransferParams {
    toAddress: string
    amount: number
    decimals?: number
    tokenAddress: string
}

export interface TransferResponse {
    txHash: string
}

export interface ApproveParams {
    spender: string
    amount: number
    tokenAddress: string
}

export interface ApproveResponse {
    txHash: string
}