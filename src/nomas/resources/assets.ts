/* eslint-disable @typescript-eslint/no-require-imports */
let browser: typeof import("webextension-polyfill") | null = null

try {
    // Only works when extension is installed
    browser = require("webextension-polyfill")
} catch {
    browser = null
}

export const getUrl = (path: string) => {
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
            petRisingGameBackground: getUrl("/assets/app/pet-rising-game-bg.png")
        },
        tokens: {
            aptos: getUrl("/assets/tokens/aptos.png"),
            mon: getUrl("/assets/tokens/mon.png"),
            solana: getUrl("/assets/tokens/solana.png"),
            sui: getUrl("/assets/tokens/sui.jpeg"),
            usdc: getUrl("/assets/tokens/usdc.svg"),
            eth: getUrl("/assets/tokens/ethereum.png"),
            btc: getUrl("/assets/tokens/bitcoin.svg"),
            xpl: getUrl("/assets/tokens/xpl.jpg"),
            usdt: getUrl("/assets/tokens/usdt.svg"),
            "2z": getUrl("/assets/tokens/2z.svg"),
            bonk: getUrl("/assets/tokens/bonk.svg"),
            fartcoin: getUrl("/assets/tokens/fartcoin.svg"),
            pump: getUrl("/assets/tokens/pump.svg"),
            spx: getUrl("/assets/tokens/spx.svg")
        },
        hyperliquid: {
            logo: getUrl("/assets/hyperliquid/logo.svg"),
            btc: getUrl("/assets/hyperliquid/btc.svg"),
            eth: getUrl("/assets/hyperliquid/eth.svg"),
            sol: getUrl("/assets/hyperliquid/sol.svg")
        },
        chains: {
            hyperliquid: {
                iconUrl: getUrl("/assets/chains/hyperliquid.webp"),
                iconInvertedUrl: getUrl("/assets/chains/hyperliquid.webp")
            },
            bitcoin: {
                iconUrl: getUrl("/assets/chains/bitcoin.svg"),
                iconInvertedUrl: getUrl("/assets/chains/bitcoin.svg")
            },
            plasma: {
                iconUrl: getUrl("/assets/chains/plasma.jpg"),
                iconInvertedUrl: getUrl("/assets/chains/plasma.jpg")
            },
            bsc: {
                iconUrl: getUrl("/assets/chains/bsc.svg"),
                iconInvertedUrl: getUrl("/assets/chains/bsc.svg")
            },
            polygon: {
                iconUrl: getUrl("/assets/chains/polygon.svg"),
                iconInvertedUrl: getUrl("/assets/chains/polygon.svg")
            },
            ethereum: {
                iconUrl: getUrl("/assets/chains/ethereum.png"),
                iconInvertedUrl: getUrl("/assets/chains/ethereum.png")
            },
            avalanche: {
                iconUrl: getUrl("/assets/chains/avalanche.svg"),
                iconInvertedUrl: getUrl("/assets/chains/avalanche.svg")
            },
            fantom: {
                iconUrl: getUrl("/assets/chains/fantom.svg"),
                iconInvertedUrl: getUrl("/assets/chains/fantom.svg")
            },
            arbitrum: {
                iconUrl: getUrl("/assets/chains/arbitrum.png"),
                iconInvertedUrl: getUrl("/assets/chains/arbitrum.png")
            },
            base: {
                iconUrl: getUrl("/assets/chains/base.svg"),
                iconInvertedUrl: getUrl("/assets/chains/base.svg")
            },
            aptos: {
                iconUrl: getUrl("/assets/chains/aptos.png"),
                iconInvertedUrl: getUrl("/assets/chains/aptos-inverted.svg")
            },
            monad: {
                iconUrl: getUrl("/assets/chains/monad.png"),
                iconInvertedUrl: getUrl("/assets/chains/monad.png")
            },
            solana: {
                iconUrl: getUrl("/assets/chains/solana.png"),
                iconInvertedUrl: getUrl("/assets/chains/solana.png")
            },
            sui: {
                iconUrl: getUrl("/assets/chains/sui.jpeg"),
                iconInvertedUrl: getUrl("/assets/chains/sui.jpeg")
            }
        },
        aggregator: {
            madhouse: {
                logo: getUrl("/assets/aggregators/madhouse.webp")
            },
            jupiter: {
                logo: getUrl("/assets/aggregators/jupiter.png")
            },
            lifi: {
                logo: getUrl("/assets/aggregators/lifi.png")
            },
            cetus: {
                logo: getUrl("/assets/aggregators/cetus.png")
            }
        },
        mixin: {
            pyth: {
                iconUrl: getUrl("/assets/mixin/pyth.svg")
            }
        },
        game: {
            petRisingStoreLogo: getUrl("/assets/game/game-ui/pet-rising.png"),
            nomasCoin: getUrl("/assets/game/coin/nomas-token.png"),
            bgHome: getUrl("/assets/game/building/bg-home.webp"),
            shop: getUrl("/assets/game/building/shop.webp"),
            home: getUrl("/assets/game/building/home.webp")
        }
    }
}
