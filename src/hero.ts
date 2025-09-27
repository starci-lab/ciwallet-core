// hero.ts
import { heroui } from "@heroui/react"
export default heroui({
    themes: {
        light: {
            colors: {
                // cards
                content2: {
                    // lighter body
                    //DEFAULT: "#131313",
                    // darker body
                    "100": "#131313",
                    "200": "#070707",
                },
                // inputs
                content3: {
                    // button
                    // DEFAULT: "#323232",
                    // input 
                    "100": "#1D1D1D",
                    // border button    
                    "200": "#565656",
                    // innter button color
                    "300": "#131313",
                },
                // text
                foreground: {
                    // text default
                    DEFAULT: "#EBEBEB",
                    // text gray
                    "100": "#B3B3B3",
                },
                default: {
                    // override heroui default text color
                    foreground: "#EBEBEB",
                    // override heroui default background color for inputs
                    DEFAULT: "#323232",
                }
            },
        }
    },
})