import React from "react"
//import { Swap } from "./components"
//import { PotfolioPage } from "./components/reusable/pages"
import { Mnemonic, WalletGenerator, WalletDexie } from "@ciwallet-sdk/classes"
import { ChainId } from "@ciwallet-sdk/types"
import { useEffect } from "react"
export const Nomas = () => {
    useEffect(() => {
        // luu o redux => singleton
        const mnemonic = new Mnemonic().generate(true)
        const walletGenerator = new WalletGenerator()
        const evmWallet = walletGenerator.generateWallet({
            mnemonic, 
            chainId: ChainId.Monad,
        })
        const suiWallet = walletGenerator.generateWallet({
            mnemonic,
            chainId: ChainId.Sui,
        })
        const solanaWallet = walletGenerator.generateWallet({
            mnemonic,
            chainId: ChainId.Solana,
        })
        const walletDexie = new WalletDexie("WalletDB")
        walletDexie.wallets.add({
            name: "EvmWallet",
            address: evmWallet.accountAddress,
            publicKey: evmWallet.publicKey,
            iconBlob: new Blob(),
            encryptedPrivateKey: evmWallet.privateKey,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isSelected: false,
            chainId: ChainId.Monad,
        })
        alert("Wallet added")
    }, [])
    
    return (
        <div className="text-red-500"> 
            {new Mnemonic().generate(true)}
            <br />
            {new Mnemonic().generate()}
            <br />
            {/* <Header/> */}
        </div>
    )
}