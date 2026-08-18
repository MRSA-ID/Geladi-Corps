// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import partytown from "@astrojs/partytown";
import robotsTxt from "astro-robots-txt";

// https://astro.build/config
export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				"coolshapes-react": "coolshapes-react/dist/esm/coolshapes.js",
			},
		},
		ssr: {
			noExternal: ["coolshapes-react"],
		},
	},

	output: "static",
	image: {
		remotePatterns: [
			{
				protocol: "https",
			},
		],
		domains: ["deifkwefumgah.cloudfront.net", "images.unsplash.com"],
	},
	integrations: [react(), sitemap(), partytown(), robotsTxt()],
});
