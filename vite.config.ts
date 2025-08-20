import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@/types": path.resolve(__dirname, "./packages/types"),
            "@/components": path.resolve(__dirname, "./packages/components"),
            "@/providers": path.resolve(__dirname, "./packages/providers"),
            "@/utils": path.resolve(__dirname, "./packages/utils"),
            "@/classes": path.resolve(__dirname, "./packages/classes"),
        },
    },
})
