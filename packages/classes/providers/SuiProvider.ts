import type { Chain, IWalletAdapter } from "@ciwallet-sdk/providers"
import type { ChainId, Network } from "@ciwallet-sdk/types"
import type {
  ApproveParams,
  ApproveResponse,
  IAction,
  TransferParams,
  TransferResponse,
} from "./IAction"
import type {
  FetchBalanceParams,
  FetchBalanceResponse,
  FetchTokenMetadataParams,
  FetchTokenMetadataResponse,
  IQuery,
} from "./IQuery"

import { SuiClient, getFullnodeUrl, type CoinBalance } from "@mysten/sui/client" // ✅ new entrypoint
import { Transaction } from "@mysten/sui/transactions"
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519"
import { fromBase64, toBase64 } from "@mysten/bcs"

export class SuiProvider implements IAction, IQuery {
  private readonly chain: Chain
  private readonly client: SuiClient
  private readonly accountAddress: string

  constructor(
    public readonly chainId: ChainId,
    public readonly network: Network,
    public readonly walletAdapter: IWalletAdapter
  ) {
    const { chains } = this.walletAdapter
    if (!chains.some((chain) => chain.chainId === chainId)) {
      throw new Error(`Chain ${chainId} is not supported`)
    }
    this.chain = chains.find((chain) => chain.chainId === chainId)!
    this.client = new SuiClient({ url: this.chain.rpcs.at(0)! })
    this.accountAddress =
      "0x57eaa973b4ce408e82b1c67667f33e9559d30d952baf5d9b3d994eb5ccf8d92d"
  }

  /** Transfer SUI or other coin */
  async transfer({
    amount,
    toAddress,
    tokenAddress,
    decimals = 9,
  }: TransferParams): Promise<TransferResponse> {
    const tx = new Transaction()

    tx.setSender(this.accountAddress)
    tx.setGasBudget(5000000)

    if (!tokenAddress || tokenAddress === "native") {
      const [coin] = tx.splitCoins(tx.gas, [
        tx.pure.u64(amount * 10 ** decimals),
      ])
      tx.transferObjects([coin], tx.pure.address(toAddress))
    } else {
      const coins = await this.client.getCoins({
        owner: this.accountAddress,
        coinType: tokenAddress,
      })

      if (!coins.data.length) {
        throw new Error(`No coins of type ${tokenAddress} found`)
      }

      const coinObject = coins.data[0]
      const actualDecimals = 6
      const [splitCoin] = tx.splitCoins(tx.object(coinObject.coinObjectId), [
        tx.pure.u64(amount * 10 ** actualDecimals),
      ])

      tx.transferObjects([splitCoin], tx.pure.address(toAddress))
    }

    if (!this.walletAdapter.signTransaction) {
      throw new Error("Wallet adapter does not support signTransaction")
    }

    const bytes = await tx.build({ client: this.client })

    const signed = await this.walletAdapter.signTransaction({
      chainId: this.chainId,
      network: this.network,
      transaction: toBase64(bytes),
    })

    const res = await this.client.executeTransactionBlock({
      transactionBlock: bytes,
      signature: signed.signature, // base64 string
      options: {
        showEffects: true,
        showEvents: true,
        showObjectChanges: true,
      },
    })

    return { txHash: res.digest }
  }

  /** Fetch balance of SUI or a coin */
  async fetchBalance({
    accountAddress,
    tokenAddress,
    decimals = 9,
  }: FetchBalanceParams): Promise<FetchBalanceResponse> {
    const address = accountAddress || this.accountAddress

    let balance: CoinBalance

    if (!tokenAddress || tokenAddress === "native") {
      balance = await this.client.getBalance({ owner: address })
    } else {
      balance = await this.client.getBalance({
        owner: address,
        coinType: tokenAddress,
      })
    }

    return { amount: Number(balance.totalBalance) / 10 ** decimals }
  }

  async fetchTokenMetadata(
    params: FetchTokenMetadataParams
  ): Promise<FetchTokenMetadataResponse> {
    const metadata = await this.client.getCoinMetadata({
      coinType: params.tokenAddress!,
    })

    return {
      name: metadata?.name || "",
      symbol: metadata?.symbol || "",
      decimals: metadata?.decimals || 0,
      iconUrl: metadata?.iconUrl || "",
    }
  }

  async approve({
    spender,
    amount,
    tokenAddress,
  }: ApproveParams): Promise<ApproveResponse> {
    // Sui doesn’t have ERC20-style approve
    console.log(spender, amount, tokenAddress)

    throw new Error("Approve not supported on Sui yet")
  }
}
