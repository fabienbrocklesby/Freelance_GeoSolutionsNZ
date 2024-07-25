/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {},
	},
	daisyui: {
		themes: [
			{
				defaultTheme: {
					primary: "#2db875",
					secondary: "#f3a1a0",
					accent: "#3a4a6a",
					neutral: "#f0f4f8",
					"base-100": "#ffffff",
				},
			},
		],
	},
	plugins: [require("daisyui"), require("@tailwindcss/forms")],
};
