//import { Swap } from "./components"
//import { PotfolioPage } from "./components/reusable/pages"
import { InitFunction } from "./components/reusable/functions"
import { SingletonHookProvider } from "./hooks/singleton"

export const Nomas = () => {
    // useEffect(() => {
    //     // luu o redux => singleton
    //     const mnemonic = new Mnemonic().generate(true)
    //     const walletGenerator = new WalletGenerator()
    //     const evmWallet = walletGenerator.generateWallet({
    //         mnemonic,
    //         chainId: ChainId.Monad,
    //     })
    //     console.log("evmWallet", mnemonic)
    //     const suiWallet = walletGenerator.generateWallet({
    //         mnemonic,
    //         chainId: ChainId.Sui,
    //     })
    //     const solanaWallet = walletGenerator.generateWallet({
    //         mnemonic,
    //         chainId: ChainId.Solana,
    //     })
    //     const walletDexie = new WalletDexie("WalletDB")
    //     walletDexie.wallets.add({
    //         name: "EvmWallet",
    //         address: evmWallet.accountAddress,
    //         publicKey: evmWallet.publicKey,
    //         iconBlob: new Blob(),
    //         encryptedPrivateKey: evmWallet.privateKey,
    //         createdAt: Date.now(),
    //         updatedAt: Date.now(),
    //         isSelected: false,
    //         chainId: ChainId.Monad,
    //     })
    // }, [])

    return (
        <SingletonHookProvider>
            <InitFunction />
            {/* <Swap/>  */}
        </SingletonHookProvider>
    )
}
