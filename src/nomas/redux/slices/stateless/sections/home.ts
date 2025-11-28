import { ChainId, TokenId, type ChainIdWithAllNetwork, UnifiedTokenId } from "@ciwallet-sdk/types"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { type SelectedChainId, type TokenItem } from "@/nomas/redux"

export enum SelectedTokenType {
    Token = "token",
    UnifiedToken = "unified-token",
}
  
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
    SearchToken = "search-token",
    ChooseNetwork = "choose-network",
}

export enum WithdrawFunctionPage {
    Withdraw = "withdraw",
    ChooseNetwork = "choose-network",
    SelectToken = "select-token",
    TransactionReceipt = "transaction-receipt",
}

export enum GameFunctionPage {
    GameSplash = "game-splash",
    Shop = "shop",
    PetDetails = "pet-details",
}

export interface HomeSectionSlice {
    homeSelectorTab: HomeSelectorTab;
    portfolioSelectedChainId: ChainId;
    selectedTokenId: TokenId;
    visible: boolean;
    action: HomeAction;
    selectedFromAccountId: string;
    depositSelectedChainId: ChainId;
    depositTokenId?: TokenId;
    depositFunctionPage: DepositFunctionPage;
    portfolioFunctionPage: PortfolioFunctionPage;
    expandTokenDetails: boolean;
    tokenItems: Array<TokenItem>;
    withdrawFunctionPage: WithdrawFunctionPage;
    searchTokenQuery: string;
    searchSelectedChainId: ChainIdWithAllNetwork;
    // selected token
    selectedTokenType: SelectedTokenType
    selectedUnifiedTokenId: UnifiedTokenId
    selectedChainId: SelectedChainId
    searchSelectedChainIdQuery: string;
    gameFunctionPage: GameFunctionPage;
}

export interface SetSelectedToken {
    type: SelectedTokenType
    id: TokenId | UnifiedTokenId
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
    withdrawFunctionPage: WithdrawFunctionPage.Withdraw,
    searchTokenQuery: "",
    searchSelectedChainId: "all-network",
    selectedTokenType: SelectedTokenType.Token,
    selectedUnifiedTokenId: UnifiedTokenId.Usdc,
    selectedChainId: ChainId.Monad,
    gameFunctionPage: GameFunctionPage.GameSplash,
    searchSelectedChainIdQuery: "",
}

export const homeSlice = createSlice({
    name: "home",
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
        setDepositTokenId: (state, action: PayloadAction<TokenId | undefined>) => {
            state.depositTokenId = action.payload
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
        setWithdrawFunctionPage: (state, action: PayloadAction<WithdrawFunctionPage>) => {
            state.withdrawFunctionPage = action.payload
        },
        setSearchTokenQuery: (state, action: PayloadAction<string>) => {
            state.searchTokenQuery = action.payload
        },
        setSearchSelectedChainId: (state, action: PayloadAction<ChainIdWithAllNetwork>) => {
            state.searchSelectedChainId = action.payload
        },
        setSelectedTokenType: (state, action: PayloadAction<SelectedTokenType>) => {
            state.selectedTokenType = action.payload
        },
        setSelectedUnifiedTokenId: (state, action: PayloadAction<UnifiedTokenId>) => {
            state.selectedUnifiedTokenId = action.payload
        },
        setSelectedChainId: (state, action: PayloadAction<SelectedChainId>) => {
            state.selectedChainId = action.payload
        },
        setSelectedToken: (state, action: PayloadAction<SetSelectedToken>) => {
            state.selectedTokenType = action.payload.type
            if (action.payload.type === SelectedTokenType.Token) {
                state.selectedTokenId = action.payload.id as TokenId
            } else {
                state.selectedUnifiedTokenId = action.payload.id as UnifiedTokenId
            }
        },
        setGameFunctionPage: (state, action: PayloadAction<GameFunctionPage>) => {
            state.gameFunctionPage = action.payload
        },
        setSearchSelectedChainIdQuery: (state, action: PayloadAction<string>) => {
            state.searchSelectedChainIdQuery = action.payload
        },
    },
})

export const { 
    setHomeSelectorTab, 
    setPortfolioSelectedChainId, 
    setSelectedTokenId, 
    setVisible, 
    setHomeAction, 
    setSelectedFromAccountId, 
    setDepositSelectedChainId, 
    setDepositTokenId, 
    setDepositFunctionPage, 
    setPortfolioFunctionPage, 
    setExpandTokenDetails, 
    setTokenItems, 
    setWithdrawFunctionPage, 
    setSearchTokenQuery, 
    setSearchSelectedChainId,
    setSelectedTokenType, 
    setSelectedUnifiedTokenId, 
    setSelectedChainId, 
    setSelectedToken, 
    setGameFunctionPage, 
    setSearchSelectedChainIdQuery 
} = homeSlice.actions
export const homeReducer = homeSlice.reducer