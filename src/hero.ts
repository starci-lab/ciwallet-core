// hero.ts
import { heroui } from "@heroui/react"
export default heroui({
    themes: {
        light: {
            colors: {
                default: {
                    DEFAULT: "#1D1D1D",      // => bg-default
                    foreground: "#EBEBEB"
                },
                content2: {
                    DEFAULT: "#070707"
                },
                content3: {
                    DEFAULT: "#101010"
                },
                foreground: {
                    DEFAULT: "#EBEBEB",
                    "500": "#B3B3B3"
                }
            },
        },
        dark: {
            colors: {
                default: {
                    DEFAULT: "#1D1D1D",      // => bg-default
                },
                content2: {
                    DEFAULT: "#070707"
                },
                content3: {
                    DEFAULT: "#101010"
                },
                foreground: {
                    "500": "#B3B3B3",
                    "600": "#565656",
                    foreground: "#EBEBEB"
                }
            },
        },
    },
})