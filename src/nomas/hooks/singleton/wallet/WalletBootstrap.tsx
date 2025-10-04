// import React, { createContext, useCallback, useContext } from "react"
// import { Mnemonic, WalletDexie, WalletGenerator } from "@ciwallet-sdk/classes"
// import { ChainId } from "@ciwallet-sdk/types"
// import { setMnemonic } from "@/nomas/redux/slices/mnemonic"
// import { useAppDispatch } from "@/nomas/redux"

// export interface WalletBootstrapContextType {
//     bootstrap: () => Promise<void>;
// }

// const WalletBootstrapContext = createContext<WalletBootstrapContextType | null>(
//     null
// )

// export const WalletBootstrapProvider = ({ children }: { children: React.ReactNode }) => {
//     const dispatch = useAppDispatch()
//     const bootstrap = useCallback(async () => {
//         const walletDexie = new WalletDexie("WalletDB")
//         if(await walletDexie.wallets.count() > 0) {
//             return
//         }
//         const mnemonic = new Mnemonic().generate(true)
//         dispatch(setMnemonic(mnemonic))
//         const walletGenerator = new WalletGenerator()

//         const evmWallet = walletGenerator.generateWallet({
//             mnemonic,
//             chainId: ChainId.Monad,
//         })

//         const suiWallet = walletGenerator.generateWallet({
//             mnemonic,
//             chainId: ChainId.Sui,
//         })
        
//         const solanaWallet = walletGenerator.generateWallet({
//             mnemonic,
//             chainId: ChainId.Solana,
//         })

//         // Persist the first generated wallet to IndexedDB via Dexie
//         await walletDexie.wallets.add({
//             name: "EvmWallet",
//             address: evmWallet.accountAddress,
//             publicKey: evmWallet.publicKey,
//             iconBlob: new Blob(),
//             encryptedPrivateKey: evmWallet.privateKey,
//             createdAt: Date.now(),
//             updatedAt: Date.now(),
//             isSelected: false,
//             chainId: ChainId.Monad,
//         })

//         await walletDexie.wallets.add({
//             name: "SuiWallet",
//             address: suiWallet.accountAddress,
//             publicKey: suiWallet.publicKey,
//             iconBlob: new Blob(),
//             encryptedPrivateKey: suiWallet.privateKey,
//             createdAt: Date.now(),
//             updatedAt: Date.now(),
//             isSelected: false,
//             chainId: ChainId.Sui,
//         })

//         await walletDexie.wallets.add({
//             name: "SolanaWallet",
//             address: solanaWallet.accountAddress,
//             publicKey: solanaWallet.publicKey,
//             iconBlob: new Blob(),
//             encryptedPrivateKey: solanaWallet.privateKey,
//             createdAt: Date.now(),
//             updatedAt: Date.now(),
//             isSelected: false,
//             chainId: ChainId.Solana,
//         })
//     }, [])

//     return (
//         <WalletBootstrapContext.Provider value={{ bootstrap }}>
//             {children}
//         </WalletBootstrapContext.Provider>
//     )
// }

// export const useWalletBootstrap = () => {
//     const ctx = useContext(WalletBootstrapContext)
//     if (!ctx) {
//         throw new Error("useWalletBootstrap must be used within WalletBootstrapProvider")
//     }
//     return ctx
// }


