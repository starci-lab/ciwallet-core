/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("path")
const CopyPlugin = require("copy-webpack-plugin")
const webpack = require("webpack")
const Dotenv = require("dotenv-webpack")

module.exports = {
    mode: "production",
    entry: {
        content: "./src/nomas/content/main.ts",
        background: "./src/nomas/background/main.ts",
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            "@ciwallet-sdk/types": path.resolve(__dirname, "./packages/types"),
            "@ciwallet-sdk/components": path.resolve(
                __dirname,
                "./packages/components"
            ),
            "@ciwallet-sdk/pyth": path.resolve(__dirname, "./packages/pyth"),
            "@ciwallet-sdk/providers": path.resolve(
                __dirname,
                "./packages/providers"
            ),
            "@ciwallet-sdk/utils": path.resolve(__dirname, "./packages/utils"),
            "@ciwallet-sdk/classes": path.resolve(__dirname, "./packages/classes"),
            "@ciwallet-sdk/hooks": path.resolve(__dirname, "./packages/hooks"),
            "@ciwallet-sdk/misc": path.resolve(__dirname, "./packages/misc"),
            "@ciwallet-sdk/constants": path.resolve(
                __dirname,
                "./packages/constants"
            ),
            "@ciwallet-sdk/abi": path.resolve(__dirname, "./packages/abi"),
            "@ciwallet-sdk/contracts": path.resolve(
                __dirname,
                "./packages/contracts"
            ),
            "@": path.resolve(__dirname, "./src"),
        },
        fallback: {
            crypto: require.resolve("crypto-browserify"),
            stream: require.resolve("stream-browserify"),
            assert: require.resolve("assert"),
            util: require.resolve("util"),
            buffer: require.resolve("buffer"),
        },
    },
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ["@babel/preset-env", { targets: "defaults" }],
                            ["@babel/preset-react", { runtime: "automatic" }],
                            ["@babel/preset-typescript"],
                        ],
                    },
                },
            },
            {
                test: /global\.css$/,
                use: [
                    {
                        loader: "css-loader",
                        options: {
                            exportType: "string", // quan trọng để inject vào shadowRoot
                        },
                    },
                    "postcss-loader",
                ],
            },
            {
                test: /\.css$/,
                exclude: /global\.css$/,
                use: ["style-loader", "css-loader", "postcss-loader"],
            },
        ],
    },
    plugins: [
        new Dotenv({
            path: ".env", // hoặc .env.development, .env.production
        }),
        // Copy manifest và static files
        new webpack.ProvidePlugin({
            Phaser: "phaser",
            Buffer: ["buffer", "Buffer"],
        }),
        new CopyPlugin({
            patterns: [
                { from: "public/manifest.json", to: "manifest.json" },
                { from: "public/assets", to: "assets" },
            ],
        }),
        new webpack.DefinePlugin({
            "import.meta.env": JSON.stringify({
                // CI_AGGREGRATOR_URL=http://localhost:3000initial
                // VITE_LIFI_INTEGRATOR=NomasWalletLifi12
                // VITE_LIFI_API_KEY=86fb088f-5ea3-4854-85f7-8c649d40ae46.cf31cb76-8e42-4553-b956-ec1b35763077
                // VITE_BASE_URL=https://nomas.kanibot.xyz
                // VITE_BASE_SOCKET=https://nomas-colyseus.kanibot.xyz
                VITE_APP_ENV: process.env.VITE_APP_ENV || "EXTENSION",
                MODE: process.env.MODE || "production",
                CI_AGGREGRATOR_URL: process.env.CI_AGGREGRATOR_URL,
                VITE_LIFI_INTEGRATOR:
          process.env.VITE_LIFI_INTEGRATOR || "NomasWalletLifi12",
                VITE_LIFI_API_KEY:
          process.env.VITE_LIFI_API_KEY ||
          "86fb088f-5ea3-4854-85f7-8c649d40ae46.cf31cb76-8e42-4553-b956-ec1b35763077",
                VITE_BASE_URL:
          process.env.VITE_BASE_URL ||
          "https://nomas.kanibot.xyz",
                VITE_COLYSEUS_URL:
          process.env.VITE_COLYSEUS_URL ||
          "https://nomas-colyseus.kanibot.xyz",
            }),
        }),
    ],
    optimization: {
        splitChunks: false,
    },
    experiments: {
        topLevelAwait: true,
    },
    infrastructureLogging: { level: "info" },
}
