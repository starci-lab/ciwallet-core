import { useFormik } from "formik"
import * as Yup from "yup"
import { ChainId, Platform, TokenId } from "@ciwallet-sdk/types"
import {
    ERC20Contract,
} from "@ciwallet-sdk/contracts"
import { selectSelectedAccountByPlatform, useAppSelector } from "@/nomas/redux"
import { useWalletKit } from "@ciwallet-sdk/providers"
import { ethers } from "ethers"
import { AggregatorId, type ProtocolData } from "@ciwallet-sdk/classes"
import type { EvmSerializedTx } from "@ciwallet-sdk/classes"
import { useBatchAggregatorSwrMutations } from "../mixin"
import SuperJSON from "superjson"
import { toRaw } from "@ciwallet-sdk/utils"
import { useContext } from "react"
import { FormikContext } from "./FormikProvider"
import { useAggregatorSelector } from "./useAggregatorSelector"

export interface Aggregation {
    aggregator: AggregatorId;
    amountOut: number;
}

export interface SwapFormikValues {
    balanceIn: number;
    balanceOut: number;
    tokenIn: TokenId;
    tokenOut: TokenId;
    tokenInChainId: ChainId;
    tokenOutChainId: ChainId;
    isInput: boolean;
    amountIn: string;
    amountOut: string;
    slippage: number;
    tokenInFocused: boolean;
    quoting: boolean;
    aggregations: Array<Aggregation>;
    bestAggregationId: AggregatorId;
    refreshKey: number;
    protocols: Array<ProtocolData>;
}

const swapValidationSchema = Yup.object({
    balanceIn: Yup.number()
        .min(0, "Balance In must be more or equal to 0")
        .required("Balance In is required"),
    balanceOut: Yup.number()
        .min(0, "Balance Out must be more or equal to 0")
        .required("Balance Out is required"),
    tokenIn: Yup.string()
        .required("Token In is required")
        .notOneOf(
            [Yup.ref("tokenOut")],
            "Token In and Token Out cannot be the same"
        ),
    tokenOut: Yup.string().required("Token Out is required"),
    amountIn: Yup.number()
        .moreThan(0, "Amount In must be > 0")
        .required("Amount In is required")
        .test(
            "amountIn-less-than-balance",
            "Amount In cannot exceed Balance In",
            function (value) {
                const { balanceIn } = this.parent
                return value !== undefined && value <= balanceIn
            }
        ),
    amountOut: Yup.number()
        .moreThan(0, "Amount Out must be > 0")
        .required("Amount Out is required"),
    slippage: Yup.number()
        .moreThan(0, "Slippage must be > 0")
        .max(100, "Slippage must be ≤ 100")
        .required("Slippage is required"),
})

export const useSwapFormik = () => {
    const context = useContext(FormikContext)
    if (!context) {
        throw new Error(
            "useSwapFormik must be used within a FormikProvider"
        )
    }
    return context.swapFormik
}

export const useSwapFormikCore = () => {
    const network = useAppSelector((state) => state.persists.session.network)
    const rpcs = useAppSelector((state) => state.persists.session.rpcs)
    const selectedAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, Platform.Evm))
    const { adapter } = useWalletKit()
    const { swrMutation } = useBatchAggregatorSwrMutations()
    const formik = useFormik<SwapFormikValues>({
        initialValues: {
            balanceIn: 0,
            balanceOut: 0,
            tokenIn: TokenId.MonadTestnetUsdc,
            tokenOut: TokenId.MonadTestnetMon,
            tokenInChainId: ChainId.Monad,
            tokenOutChainId: ChainId.Monad,
            isInput: true,
            amountIn: "0",
            amountOut: "0",
            slippage: 0.005,
            tokenInFocused: false,
            quoting: false,
            aggregations: [],
            protocols: [],
            bestAggregationId: AggregatorId.Madhouse,
            refreshKey: 0,
        },
        validationSchema: swapValidationSchema,
        onSubmit: async (values) => {
            try {
                const senderAddress = selectedAccount?.accountAddress ?? ""
                const rpcProvider = new ethers.JsonRpcProvider(
                    "https://testnet-rpc.monad.xyz"
                )
                const erc20Contract = ERC20Contract({
                    chainId: values.tokenInChainId,
                    network,
                    tokenAddress: selectedAccount?.accountAddress ?? "",
                })
                const nonce = await rpcProvider.getTransactionCount(senderAddress)
                const { to, data, value } = SuperJSON.parse<EvmSerializedTx>(
                    swrMutation.data?.madhouse.serializedTx || ""
                )
                if (!to || !data || !value) {
                    throw new Error("Invalid transaction data")
                }
                // approve the erc20 contract
                const approveTx = await erc20Contract
                    .getFunction("approve")
                    .populateTransaction(
                        to,
                        toRaw(
                            Number(values.amountIn),
                            18
                        ).toString()
                    )
                approveTx.chainId = BigInt(10143)
                approveTx.maxPriorityFeePerGas = ethers.parseUnits("2", "gwei") // ví dụ 2 gwei
                approveTx.maxFeePerGas = ethers.parseUnits("50", "gwei") // ví dụ 100 gwei
                approveTx.gasLimit = BigInt(100000)
                approveTx.nonce = nonce
                const transaction = ethers.Transaction.from(approveTx).unsignedSerialized
                const response = await adapter.signAndSendTransaction?.({
                    transaction,
                    privateKey: selectedAccount?.privateKey ?? "",
                    rpcs: rpcs[values.tokenInChainId][network],
                    chainId: values.tokenInChainId,
                    network,
                })
                if (!response) {
                    throw new Error("Kimochi")
                }
                alert(response.signature)

                const tx = new ethers.Transaction()
                tx.to = to
                tx.data = data
                tx.value = value
                tx.chainId = BigInt(10143)
                tx.maxPriorityFeePerGas = ethers.parseUnits("2", "gwei") // ví dụ 2 gwei
                tx.maxFeePerGas = ethers.parseUnits("67.5", "gwei") // ví dụ 100 gwei
                tx.gasLimit = BigInt(1000000)
                tx.nonce = nonce + 1

                const transaction2 = ethers.Transaction.from(tx).unsignedSerialized
                const response2 = await adapter.signAndSendTransaction?.({
                    transaction: transaction2,
                    privateKey: selectedAccount?.privateKey ?? "",
                    rpcs: rpcs[values.tokenInChainId][network],
                    chainId: values.tokenInChainId,
                    network,
                })
                if (!response2) {
                    throw new Error("Kimochi")
                }
                alert(response2.signature)
            } catch (error) {
                console.error(error)
            }
        },
    })
    // aggregator selector
    useAggregatorSelector(formik)

    return formik
}
