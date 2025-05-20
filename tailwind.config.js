/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: "#030014",
                secondary: "#2678FF",
                light: {
                    100: "#6B7280",
                    200: "#A8B5DB",
                    300: "#9CA4AB",
                },
                dark: {
                    100: "#000000",
                    200: "#0F0D23",
                },
                accent: "#AB8BFF",
            },
            fontFamily: {
                roboto: ["Roboto_400Regular"],
                "roboto-500": ["Roboto_500Medium"],
                "roboto-600": ["Roboto_600SemiBold"],
                "roboto-700": ["Roboto_700Bold"],
            },
        },
    },
    plugins: [],
};
