/* eslint-disable @typescript-eslint/no-require-imports */
let browser: typeof import("webextension-polyfill") | null = null

try {
    // Chỉ hoạt động khi có extension
    browser = require("webextension-polyfill")
} catch {
    browser = null
}

const getUrl = (path: string) => {
    const isExtension = import.meta.env.VITE_APP_ENV === "EXTENSION"
    return (isExtension ? browser?.runtime.getURL(path) : path) ?? ""
}

export const assetsConfig = () => {
    return {
        app: {
            logo: getUrl("/assets/app/logo.svg"),
            rocket: getUrl("/assets/app/rocket.svg"),
            create: getUrl("/assets/app/create.svg"),
            encrypt: getUrl("/assets/app/encrypt.svg"),
            done: getUrl("/assets/app/done.svg"),
            petRisingGameButton: getUrl("/assets/app/pet-rising-game-button.png"),
            petRisingGameLogo: getUrl("/assets/app/pet-rising-game-logo.png"),
            petRisingGameBackground: getUrl("/assets/app/pet-rising-game-bg.png"),
        },
        tokens: {
            aptos: getUrl("/assets/tokens/aptos.svg"),
            mon: getUrl("/assets/tokens/mon.png"),
            solana: getUrl("/assets/tokens/solana.png"),
            sui: getUrl("/assets/tokens/sui.jpeg"),
            usdc: getUrl("/assets/tokens/usdc.svg"),
        },
        chains: {
            aptos: {
                iconUrl: getUrl("/assets/chains/aptos.svg"),
                iconInvertedUrl: getUrl("/assets/chains/aptos-inverted.svg"),
            },
            monad: {
                iconUrl: getUrl("/assets/chains/monad.png"),
                iconInvertedUrl: getUrl("/assets/chains/monad.png"),
            },
            solana: {
                iconUrl: getUrl("/assets/chains/solana.png"),
                iconInvertedUrl: getUrl("/assets/chains/solana.png"),
            },
            sui: {
                iconUrl: getUrl("/assets/chains/sui.jpeg"),
                iconInvertedUrl: getUrl("/assets/chains/sui.jpeg"),
            }
        }
    }
}