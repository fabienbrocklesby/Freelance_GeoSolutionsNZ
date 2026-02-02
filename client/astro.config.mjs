import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import tailwind from "@astrojs/tailwind";
import "dotenv/config";

export default defineConfig({
	site: process.env.PUBLIC_SITE_URL || "https://geosolutions.nz",
	output: "server",
	adapter: node({
		mode: "standalone",
	}),
	integrations: [tailwind()],
});
