import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import pluginReact from "eslint-plugin-react"
import { defineConfig } from "eslint/config"
// import prettier from "eslint-plugin-prettier"

export default defineConfig([
    { ignores: ["dist/**", "node_modules/**", "public/**"] },
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: {
            globals: globals.browser,
            parserOptions: { ecmaFeatures: { jsx: true } }
        }
    },
    tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    {
        settings: { react: { version: "detect", jsxRuntime: "automatic" } },
        rules: {
            "react/display-name": "off",
            "react/react-in-jsx-scope": "off",
            indent: ["error", 4],
            "react-hooks/exhaustive-deps": "off",
            "linebreak-style": "off",
            quotes: ["error", "double"],
            semi: ["error", "never"],
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_"
                }
            ],
            "no-case-declarations": "off"
            // "prettier/prettier": "error"
        }
    }
])
