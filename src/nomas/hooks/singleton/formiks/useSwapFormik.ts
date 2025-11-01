import { useFormik } from "formik"
import * as Yup from "yup"
import { ChainId, Platform, TokenId, type ChainIdWithAllNetwork, Network } from "@ciwallet-sdk/types"
import { selectSelectedAccountByPlatform, useAppSelector } from "@/nomas/redux"
import { AggregatorId, type ProtocolData } from "@ciwallet-sdk/classes"
import { useContext, useEffect } from "react"
import { FormikContext } from "./FormikProvider"
import { useAggregatorSelector } from "./useAggregatorSelector"
import { aggregatorManagerObj } from "@/nomas/obj"
import { useBatchAggregatorSwrMutation } from "../mixin"

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
    tokenIn: TokenId;
    tokenOut: TokenId;
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
    const selectedAccount = useAppSelector((state) => selectSelectedAccountByPlatform(state.persists, Platform.Evm))
    const swrMutation = useBatchAggregatorSwrMutation()
        
    useEffect(() => {
        if (network === Network.Mainnet) {
            formik.setFieldValue("tokenIn", TokenId.MonadMainnetUsdc)
            formik.setFieldValue("tokenOut", TokenId.MonadMainnetMon)
        } else {
            formik.setFieldValue("tokenIn", TokenId.MonadTestnetUsdc)
            formik.setFieldValue("tokenOut", TokenId.MonadMainnetMon)
        }
    }, [network])
    
    const formik = useFormik<SwapFormikValues>({
        initialValues: {
            searchSelectedChainId: "all-network",
            searchTokenQuery: "",
            balanceIn: 0,
            balanceOut: 0,
            tokenIn: TokenId.MonadTestnetUsdc,
            tokenOut: TokenId.MonadTestnetMon,
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
                alert(response?.txHash)
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
