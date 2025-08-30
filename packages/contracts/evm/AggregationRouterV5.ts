
import { ethers } from "ethers"
import { Contract } from "ethers"
import { AggregationRouterV5Abi} from "@ciwallet-sdk/abi"
import type { ChainId, Network } from "@ciwallet-sdk/types"

const MONAD_TESTNET_ADDRESS = "0xd555673d9a3b04ef40130e51919d2ad73c11ba39"

export interface AggregationRouterV5ContractParams {
    chainId: ChainId
    network: Network
}

export const AggregationRouterV5Contract = (
    {
        chainId, 
        network
    }: AggregationRouterV5ContractParams
) => {  
    console.log(chainId, network)
    const provider = new ethers.JsonRpcProvider("https://testnet-rpc.monad.xyz")
    return new Contract(MONAD_TESTNET_ADDRESS, AggregationRouterV5Abi, provider)
}