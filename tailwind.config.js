/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}", // thêm HeroUI vào
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}