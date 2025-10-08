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

import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmRawTransaction,
} from "@solana/web3.js"

import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  getAccount,
  TOKEN_PROGRAM_ID,
  getMint,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token"

import bs58 from "bs58"

export class SolanaProvider implements IAction, IQuery {
  private readonly chain: Chain
  private readonly connection: Connection
  private readonly publicKey: PublicKey
  constructor(
    public readonly chainId: ChainId,
    public readonly network: Network,
    public readonly walletAdapter: IWalletAdapter,
    public readonly publicKeyStr: string = "3xaKeNNV4gdAs6ovtjrxtfUqc5bG2q6hbokP8qM3ToQu",
    public readonly privateKeyStr: string = "52xsZAJqLEECmk8MZML2on3ViwBjJrffenB7KBKz7vEVjULKNrPHvhjBeoNM5DwDo2SKvmc8XuLhcwDHSjSSSuMb"
  ) {
    const { chains } = this.walletAdapter
    if (!chains.some((chain) => chain.chainId === chainId)) {
      throw new Error(`Chain ${chainId} is not supported`)
    }
    this.chain = chains.find((chain) => chain.chainId === chainId)!
    this.connection = new Connection(this.chain.rpcs.at(0)!, "confirmed")
    this.publicKey = new PublicKey(this.publicKeyStr)
  }

  /** Transfer SOL or SPL token */
  async transfer({
    amount,
    toAddress,
    tokenAddress,
    decimals = 9,
  }: TransferParams): Promise<TransferResponse> {
    const fromPubkey = this.publicKey
    const toPubkey = new PublicKey(toAddress)

    let tx: Transaction
    if (!tokenAddress) {
      tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: BigInt(Math.floor(amount * 10 ** decimals)),
        })
      )
    } else {
      const mint = new PublicKey(tokenAddress)
      const mintInfo = await getMint(this.connection, mint)
      const decimals = mintInfo.decimals

      const fromAta = await getAssociatedTokenAddress(mint, fromPubkey)
      const toAta = await getAssociatedTokenAddress(mint, toPubkey)

      const toAccountInfo = await this.connection.getAccountInfo(toAta)
      if (!toAccountInfo) {
        tx = new Transaction().add(
          createAssociatedTokenAccountInstruction(
            fromPubkey,
            toAta,
            toPubkey,
            mint
          ),
          createTransferInstruction(
            fromAta,
            toAta,
            fromPubkey,
            BigInt(Math.floor(amount * 10 ** decimals)),
            [],
            TOKEN_PROGRAM_ID
          )
        )
      } else {
        tx = new Transaction().add(
          createTransferInstruction(
            fromAta,
            toAta,
            fromPubkey,
            BigInt(Math.floor(amount * 10 ** decimals)),
            [],
            TOKEN_PROGRAM_ID
          )
        )
      }
    }

    const { blockhash } = await this.connection.getLatestBlockhash()
    tx.recentBlockhash = blockhash
    tx.feePayer = fromPubkey

    if (!this.walletAdapter.signTransaction) {
      throw new Error("Wallet adapter does not support signTransaction")
    }

    const serializedTx = tx.serialize({ requireAllSignatures: false })

    const signedResponse = await this.walletAdapter.signTransaction({
      chainId: this.chainId,
      network: this.network,
      transaction: Buffer.from(serializedTx).toString("base64"),
      privateKey: this.privateKeyStr,
      rpcs: this.chain.rpcs,
    })

    if (!signedResponse.signedTransaction) {
      throw new Error("No signed transaction returned from wallet adapter")
    }

    const sig = await sendAndConfirmRawTransaction(
      this.connection,
      Buffer.from(signedResponse.signedTransaction, "base64"),
      { commitment: "confirmed" }
    )

    return { txHash: sig }
  }

  /** Fetch balance of SOL or SPL token */
  async fetchBalance({
    accountAddress,
    tokenAddress,
    decimals = 9,
  }: FetchBalanceParams): Promise<FetchBalanceResponse> {
    const pubkey = new PublicKey(accountAddress)

    if (!tokenAddress) {
      const balance = await this.connection.getBalance(pubkey)
      return { amount: balance / 10 ** decimals }
    }

    try {
      const mint = new PublicKey(tokenAddress)
      const ata = await getAssociatedTokenAddress(mint, pubkey)

      const accountInfo = await this.connection.getAccountInfo(ata)
      if (!accountInfo) {
        return { amount: 0 }
      }

      const account = await getAccount(this.connection, ata)
      return { amount: Number(account.amount) / 10 ** decimals }
    } catch (err) {
      console.error("fetchBalance error", err)
      return { amount: 0 }
    }
  }

  /** Metadata (not fully supported without Metaplex) */
  async fetchTokenMetadata(
    params: FetchTokenMetadataParams
  ): Promise<FetchTokenMetadataResponse> {
    console.log(params)
    throw new Error("Fetch metadata not implemented (need Metaplex)")
  }

  /** Approve in Solana (not the same as ERC20!) */
  async approve({
    spender,
    amount,
    tokenAddress,
  }: ApproveParams): Promise<ApproveResponse> {
    // SPL tokens don’t have “approve” like ERC20.
    // You’d need delegate authority via createApproveInstruction.
    console.log(spender, amount, tokenAddress)

    throw new Error("Approve not supported yet on Solana")
  }
}
