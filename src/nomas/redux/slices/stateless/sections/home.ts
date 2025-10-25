import { ChainId, TokenId } from "@ciwallet-sdk/types"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { type TokenItem } from "@/nomas/redux"

export enum HomeAction {
    Buy = "buy",
    Sell = "sell",
    Swap = "swap",
    Send = "send",
    Receive = "receive",
}

export enum HomeContent {
    Base = "base",
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

export enum PortfolioFunctionPage {
    Portfolio = "portfolio",
    TokenDetails = "token-details",
}

export interface HomeSectionSlice {
    homeSelectorTab: HomeSelectorTab;
    portfolioSelectedChainId: ChainId;
    selectedTokenId: TokenId;
    visible: boolean;
    action: HomeAction;
    selectedFromAccountId: string;
    depositSelectedChainId: ChainId;
    depositFunctionPage: DepositFunctionPage;
    portfolioFunctionPage: PortfolioFunctionPage;
    expandTokenDetails: boolean;
    tokenItems: Array<TokenItem>;
}

const initialState: HomeSectionSlice = {
    homeSelectorTab: HomeSelectorTab.Portfolio,
    portfolioSelectedChainId: ChainId.Monad,
    selectedTokenId: TokenId.MonadTestnetMon,
    visible: false,
    action: HomeAction.Buy,
    selectedFromAccountId: "",
    depositSelectedChainId: ChainId.Monad,
    depositFunctionPage: DepositFunctionPage.ChooseNetwork,
    portfolioFunctionPage: PortfolioFunctionPage.Portfolio,
    expandTokenDetails: false,
    tokenItems: [],
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
        setVisible: (state, action: PayloadAction<boolean>) => {
            state.visible = action.payload
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
        setPortfolioFunctionPage: (state, action: PayloadAction<PortfolioFunctionPage>) => {
            state.portfolioFunctionPage = action.payload
        },
        setExpandTokenDetails: (state, action: PayloadAction<boolean>) => {
            state.expandTokenDetails = action.payload
        },
        setTokenItems: (state, action: PayloadAction<Array<TokenItem>>) => {
            state.tokenItems = action.payload
        },
    },
})

export const { setHomeSelectorTab, setPortfolioSelectedChainId, setSelectedTokenId, setVisible, setHomeAction, setSelectedFromAccountId, setDepositSelectedChainId, setDepositFunctionPage, setPortfolioFunctionPage, setExpandTokenDetails, setTokenItems } = homeSectionSlice.actions
export const homeSectionReducer = homeSectionSlice.reducer