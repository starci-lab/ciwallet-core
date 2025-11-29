import { useFormik } from "formik"
import * as Yup from "yup"
import { ChainId, TokenId, type ChainIdWithAllNetwork } from "@ciwallet-sdk/types"
import { selectSelectedAccounts, useAppSelector } from "@/nomas/redux"
import { AggregatorId, type ProtocolData } from "@ciwallet-sdk/classes"
import { useContext } from "react"
import { FormikContext } from "./FormikProvider"
import { useAggregatorSelector } from "./useAggregatorSelector"
import { aggregatorManagerObj } from "@/nomas/obj"
import { useBatchAggregatorSwrMutation } from "../mixin"
import { chainIdToPlatform } from "@ciwallet-sdk/utils"
import { setSwapFunctionPage, SwapFunctionPage, setTxHash, setSwapSuccess, setTransactionType, TransactionType } from "@/nomas/redux"
import { useAppDispatch } from "@/nomas/redux"

export interface Aggregation {
    aggregator: AggregatorId;
    amountOut: number;
}

export enum TransactionMode {
    Default = "default",
    Instant = "instant",
}

export interface SwapFormikValues {
    balanceIn: number;
    balanceOut: number;
    tokenIn?: TokenId;
    tokenOut?: TokenId;
    tokenInChainId: ChainId;
    tokenOutChainId: ChainId;
    isInput: boolean;
    isTokenInClicked: boolean;
    amountIn: string;
    amountOut: string;
    searchSelectedChainId: ChainIdWithAllNetwork;
    searchTokenQuery: string;
    slippage: number;
    tokenInFocused: boolean;
    quoting: boolean;
    aggregations: Array<Aggregation>;
    bestAggregationId: AggregatorId;
    refreshKey: number;
    protocols: Array<ProtocolData>;
    mevProtection: boolean;
    transactionMode: TransactionMode;
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
    const selectedAccounts = useAppSelector((state) => selectSelectedAccounts(state.persists))
    const swrMutation = useBatchAggregatorSwrMutation()
    const dispatch = useAppDispatch()
    const rpcsMultichain = Object.entries(rpcs).reduce((acc, [chainId, rpcs]) => {
        acc[chainId as ChainId] = rpcs[network]
        return acc
    }, {} as Record<ChainId, Array<string>>)
    
    const formik = useFormik<SwapFormikValues>({
        initialValues: {
            searchSelectedChainId: "all-network",
            searchTokenQuery: "",
            balanceIn: 0,
            balanceOut: 0,
            tokenIn: undefined,
            tokenOut: undefined,
            tokenInChainId: ChainId.Monad,
            tokenOutChainId: ChainId.Monad,
            isInput: true,
            isTokenInClicked: true,
            amountIn: "0",
            amountOut: "0",
            slippage: 0.1,
            tokenInFocused: false,
            quoting: false,
            aggregations: [],
            protocols: [],
            bestAggregationId: AggregatorId.Madhouse,
            refreshKey: 0,
            transactionMode: TransactionMode.Default,
            mevProtection: false,
        },
        validationSchema: swapValidationSchema,
        onSubmit: async (values) => {
            const isBridge = values.tokenInChainId !== values.tokenOutChainId
            const selectedAccount = selectedAccounts[chainIdToPlatform(values.tokenInChainId)]
            switch (values.bestAggregationId) {
            case AggregatorId.Madhouse: {
                const response = await aggregatorManagerObj.getAggregatorById(AggregatorId.Madhouse)?.instance.signAndSendTransaction({
                    serializedTx: swrMutation?.data?.madhouse?.serializedTx ?? "",
                    privateKey: selectedAccount?.privateKey ?? "",
                    rpcs: rpcs[values.tokenInChainId][network],
                    fromChainId: values.tokenInChainId,
                    toChainId: values.tokenOutChainId,
                    senderAddress: selectedAccount?.accountAddress ?? "",
                    recipientAddress: selectedAccount?.accountAddress ?? "",
                    network,
                })
                dispatch(setSwapSuccess(true))
                dispatch(setTxHash(response?.txHash ?? ""))
                dispatch(setTransactionType(isBridge ? TransactionType.Bridge : TransactionType.Swap))
                dispatch(setSwapFunctionPage(SwapFunctionPage.TransactionReceipt))
                break
            }
            case AggregatorId.Jupiter: {
                const response = await aggregatorManagerObj.getAggregatorById(
                    AggregatorId.Jupiter
                )?.instance.signAndSendTransaction({
                    serializedTx: swrMutation?.data?.jupiter?.serializedTx ?? "",
                    privateKey: selectedAccount?.privateKey ?? "",
                    rpcs: rpcs[values.tokenInChainId][network],
                    fromChainId: values.tokenInChainId,
                    toChainId: values.tokenOutChainId,
                    senderAddress: selectedAccount?.accountAddress ?? "",
                    recipientAddress: selectedAccount?.accountAddress ?? "",
                    network,
                    rpcsMultichain
                })
                dispatch(setSwapSuccess(true))
                dispatch(setTxHash(response?.txHash ?? ""))
                dispatch(setTransactionType(isBridge ? TransactionType.Bridge : TransactionType.Swap))
                dispatch(setSwapFunctionPage(SwapFunctionPage.TransactionReceipt))
                break
            }
            case AggregatorId.Cetus: {
                const response = await aggregatorManagerObj.getAggregatorById(
                    AggregatorId.Cetus
                )?.instance.signAndSendTransaction({
                    serializedTx: swrMutation?.data?.cetus?.serializedTx ?? "",
                    privateKey: selectedAccount?.privateKey ?? "",
                    rpcs: rpcs[values.tokenInChainId][network],
                    fromChainId: values.tokenInChainId,
                    toChainId: values.tokenOutChainId,
                    senderAddress: selectedAccount?.accountAddress ?? "",
                    recipientAddress: selectedAccount?.accountAddress ?? "",
                    network,
                })
                dispatch(setSwapSuccess(true))
                dispatch(setTxHash(response?.txHash ?? ""))
                dispatch(setTransactionType(isBridge ? TransactionType.Bridge : TransactionType.Swap))
                dispatch(setSwapFunctionPage(SwapFunctionPage.TransactionReceipt))
                break
            }
            case AggregatorId.Lifi: {
                const response = await aggregatorManagerObj.getAggregatorById(
                    AggregatorId.Lifi
                )?.instance.signAndSendTransaction({
                    serializedTx: swrMutation?.data?.lifi?.serializedTx ?? "",
                    privateKey: selectedAccount?.privateKey ?? "",
                    rpcs: [],
                    rpcsMultichain: Object.entries(rpcs).reduce((acc, [chainId, rpcs]) => {
                        acc[chainId as ChainId] = rpcs[network]
                        return acc
                    }, {} as Record<ChainId, Array<string>>),
                    fromChainId: values.tokenInChainId,
                    toChainId: values.tokenOutChainId,
                    senderAddress: selectedAccount?.accountAddress ?? "",
                    recipientAddress: selectedAccount?.accountAddress ?? "",
                    network,
                })
                dispatch(setSwapSuccess(true))
                dispatch(setTxHash(response?.txHash ?? ""))
                dispatch(setTransactionType(isBridge ? TransactionType.Bridge : TransactionType.Swap))
                dispatch(setSwapFunctionPage(SwapFunctionPage.TransactionReceipt))
                break
            }
            default: {
                throw new Error(`Aggregator ${values.bestAggregationId} is not supported`)
            }
            }
        },
    })
    // aggregator selector
    useAggregatorSelector(formik)
    return formik
}
