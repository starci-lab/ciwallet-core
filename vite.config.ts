import inject from "@rollup/plugin-inject"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"
import commonjs from "@rollup/plugin-commonjs"
// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        commonjs({
            include: [
                "node_modules/borsh/**",
                "node_modules/safe-buffer/**",
                "node_modules/bn.js/**",
                "node_modules/buffer/**",
                "node_modules/base64-js/**",
                "node_modules/ieee754/**",
            ],
            transformMixedEsModules: true,
            requireReturnsDefault: "preferred",
        }),
        tailwindcss(),
        inject({
            Buffer: ["buffer", "Buffer"],
        }),
    ],
    resolve: {
        alias: {
            "@ciwallet-sdk/pyth": path.resolve(__dirname, "./packages/pyth"),
            "@ciwallet-sdk/types": path.resolve(__dirname, "./packages/types"),
            "@ciwallet-sdk/components": path.resolve(__dirname, "./packages/components"),
            "@ciwallet-sdk/providers": path.resolve(__dirname, "./packages/providers"),
            "@ciwallet-sdk/utils": path.resolve(__dirname, "./packages/utils"),
            "@ciwallet-sdk/classes": path.resolve(__dirname, "./packages/classes"),
            "@ciwallet-sdk/hooks": path.resolve(__dirname, "./packages/hooks"),
            "@ciwallet-sdk/misc": path.resolve(__dirname, "./packages/misc"),
            "@ciwallet-sdk/constants": path.resolve(__dirname, "./packages/constants"),
            "@ciwallet-sdk/abi": path.resolve(__dirname, "./packages/abi"),
            "@ciwallet-sdk/contracts": path.resolve(__dirname, "./packages/contracts"),
            "@": path.resolve(__dirname, "./src"),
        },
    },
})
