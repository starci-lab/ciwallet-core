import { ChainId, TokenId } from "@ciwallet-sdk/types"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export enum HomeAction {
    Buy = "buy",
    Sell = "sell",
    Swap = "swap",
    Send = "send",
    Receive = "receive",
}

export enum HomeSelectorTab {
    Portfolio = "portfolio",
    NFTs = "nfts",
    Deposit = "deposit",
    Withdraw = "withdraw",
    Transactions = "transactions",
    FiatGateway = "fiat-gateway",
}

export enum DepositFunctionPage {
    ChooseNetwork = "choose-network",
    Deposit = "deposit",
}

export interface HomeSectionSlice {
    homeSelectorTab: HomeSelectorTab;
    portfolioSelectedChainId: ChainId;
    selectedTokenId: TokenId;
    action: HomeAction;
    selectedFromAccountId: string;
    depositSelectedChainId: ChainId;
    depositFunctionPage: DepositFunctionPage;
}

const initialState: HomeSectionSlice = {
    homeSelectorTab: HomeSelectorTab.Portfolio,
    portfolioSelectedChainId: ChainId.Monad,
    selectedTokenId: TokenId.MonadTestnetMon,
    action: HomeAction.Buy,
    selectedFromAccountId: "",
    depositSelectedChainId: ChainId.Monad,
    depositFunctionPage: DepositFunctionPage.ChooseNetwork,
}

export const homeSectionSlice = createSlice({
    name: "homeSection",
    initialState,
    reducers: {
        setHomeSelectorTab: (state, action: PayloadAction<HomeSelectorTab>) => {
            state.homeSelectorTab = action.payload
        },
        setPortfolioSelectedChainId: (state, action: PayloadAction<ChainId>) => {
            state.portfolioSelectedChainId = action.payload
        },
        setSelectedTokenId: (state, action: PayloadAction<TokenId>) => {
            state.selectedTokenId = action.payload
        },
        setHomeAction: (state, action: PayloadAction<HomeAction>) => {
            state.action = action.payload
        },
        setSelectedFromAccountId: (state, action: PayloadAction<string>) => {
            state.selectedFromAccountId = action.payload
        },
        setDepositSelectedChainId: (state, action: PayloadAction<ChainId>) => {
            state.depositSelectedChainId = action.payload
        },
        setDepositFunctionPage: (state, action: PayloadAction<DepositFunctionPage>) => {
            state.depositFunctionPage = action.payload
        },
    },
})

export const { setHomeSelectorTab, setPortfolioSelectedChainId, setSelectedTokenId, setHomeAction, setSelectedFromAccountId, setDepositSelectedChainId, setDepositFunctionPage } = homeSectionSlice.actions
export const homeSectionReducer = homeSectionSlice.reducer