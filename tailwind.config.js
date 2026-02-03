/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // ★ここが重要！クラス切り替えを有効にする設定
    theme: {
        extend: {
            fontFamily: {
                bungee: ['"Bungee Shade"', 'cursive'],
                mono: ['"Space Mono"', 'monospace'],
            },
        },
    },
    plugins: [],
}