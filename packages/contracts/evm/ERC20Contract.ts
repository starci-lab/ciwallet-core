import type { ChainId, Network } from "@ciwallet-sdk/types"
import { ethers } from "ethers"
import { Contract } from "ethers"
import { ERC20Abi } from "@ciwallet-sdk/abi"

export interface ERC20ContractParams {
    chainId: ChainId
    network: Network
    tokenAddress: string
}

export const ERC20Contract   = (
    {
        chainId, 
        network,
        tokenAddress,
    }: ERC20ContractParams
) => {  
    console.log(chainId, network)
    const provider = new ethers.JsonRpcProvider("https://testnet-rpc.monad.xyz")
    return new Contract(tokenAddress, ERC20Abi, provider)
}