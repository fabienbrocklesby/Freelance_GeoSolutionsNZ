import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwind from "@astrojs/tailwind";
import "dotenv/config";

export default defineConfig({
	site: process.env.PUBLIC_SITE_URL || "https://geosolutions.nz",
	output: "server",
	adapter: cloudflare(),
	image: {
		service: {
			entrypoint: "astro/assets/services/noop",
		},
	},
	integrations: [tailwind({ applyBaseStyles: false })],
});
