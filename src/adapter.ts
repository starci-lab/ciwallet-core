import type { SignTransactionResponse } from "@ciwallet-sdk/providers"
import { ChainId, Network } from "@ciwallet-sdk/types"

// ---------- SOLANA ----------
import {
  Transaction as SolanaTransaction,
  VersionedTransaction,
  Keypair,
} from "@solana/web3.js"
import bs58 from "bs58"

// ---------- MONAD / EVM ----------
import { Wallet, JsonRpcProvider, type TransactionRequest } from "ethers"

// ---------- SUI ----------
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519"
import { fromBase64, toBase64 } from "@mysten/bcs"
import { Transaction as SuiTransaction } from "@mysten/sui/transactions"
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography"

async function getPrivateKeyFor(
  chainId: ChainId,
  network: Network
): Promise<string> {
  switch (chainId) {
    case ChainId.Solana:
      return "52xsZAJqLEECmk8MZML2on3ViwBjJrffenB7KBKz7vEVjULKNrPHvhjBeoNM5DwDo2SKvmc8XuLhcwDHSjSSSuMb"
    case ChainId.Monad:
      return "88a07f6c444b42996ecf6f365c9f7c98029a0b8c02d4ad1b5462c4386ab9c309"
    case ChainId.Sui:
      return "suiprivkey1qpxktqx4thzlcg4ldchsau68srzlh3lke78qavxhdkwugk0vgnj4q9nqyyk"
    default:
      throw new Error(`Unsupported chainId ${chainId} in getPrivateKeyFor`)
  }
}

function base64ToU8a(b64: string): Uint8Array {
  // Browser-safe base64 decode (no Buffer)
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

export const signTransaction = async ({
  chainId,
  network,
  transaction,
}: {
  chainId: ChainId
  network: Network
  transaction: string
}): Promise<SignTransactionResponse> => {
  switch (chainId) {
    case ChainId.Solana: {
      const secret = await getPrivateKeyFor(chainId, network)
      const secretBytes = bs58.decode(secret)
      const keypair = Keypair.fromSecretKey(secretBytes)
      const raw = base64ToU8a(transaction)

      try {
        const vtx = VersionedTransaction.deserialize(raw)
        vtx.sign([keypair])
        if (!vtx.signatures?.[0]) throw new Error("Failed to sign (v0)")
        return {
          signature: bs58.encode(vtx.signatures[0]),
          signedTransaction: Buffer.from(vtx.serialize()).toString("base64"),
        }
      } catch {
        const ltx = SolanaTransaction.from(raw)
        ltx.partialSign(keypair)
        if (!ltx.signature) throw new Error("Failed to sign (legacy)")
        return {
          signature: bs58.encode(ltx.signature),
          signedTransaction: Buffer.from(ltx.serialize()).toString("base64"),
        }
      }
    }
    case ChainId.Monad:
      {
        const txReq = JSON.parse(transaction) as TransactionRequest
        const priv = await getPrivateKeyFor(chainId, network)
        const provider = new JsonRpcProvider(undefined)
        const wallet = new Wallet(priv, provider)
        const signed = await wallet.signTransaction(txReq)
        return { signature: signed }
      }
      const secret = await getPrivateKeyFor(chainId, network)
      const secretBytes = bs58.decode(secret)
      const keypair = Keypair.fromSecretKey(secretBytes)
      const raw = base64ToU8a(transaction)

      try {
        const vtx = VersionedTransaction.deserialize(raw)
        vtx.sign([keypair])
        if (!vtx.signatures?.[0]) throw new Error("Failed to sign (v0)")
        return {
          signature: bs58.encode(vtx.signatures[0]),
          signedTransaction: Buffer.from(vtx.serialize()).toString("base64"),
        }
      } catch {
        const ltx = SolanaTransaction.from(raw)
        ltx.partialSign(keypair)
        
        if (!ltx.signature) throw new Error("Failed to sign (legacy)")
        
        return {
          signature: bs58.encode(ltx.signature!),
          signedTransaction: Buffer.from(ltx.serialize()).toString("base64"),
        }
      }
    case ChainId.Sui: {
      const priv = await getPrivateKeyFor(chainId, network)
      if (!priv) throw new Error("Missing private key for Sui")

      const { secretKey } = decodeSuiPrivateKey(priv)
      const keypair = Ed25519Keypair.fromSecretKey(secretKey)

      const raw = fromBase64(transaction)
      const tx = SuiTransaction.from(raw)
      const bytes = await tx.build()

      const { signature } = await keypair.signTransaction(bytes)

      return {
        signature,
        signedTransaction: toBase64(bytes),
      }
    }
    default:
      throw new Error(`signTransaction not implemented for chain ${chainId}`)
  }
}
