// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import partytown from "@astrojs/partytown";
import robotsTxt from "astro-robots-txt";

// https://astro.build/config
export default defineConfig({
	site: "https://galedicorps.com",
	output: "static",
	compressHTML: true,

	build: {
		format: "directory",
		inlineStylesheets: "auto",
		assets: "_astro",
	},

	prefetch: {
		prefetchAll: true,
		defaultStrategy: "hover",
	},

	image: {
		domains: ["deifkwefumgah.cloudfront.net", "images.unsplash.com"],
		remotePatterns: [
			{
				protocol: "https",
			},
		],
	},

	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				"coolshapes-react": "coolshapes-react/dist/esm/coolshapes.js",
			},
		},
		optimizeDeps: {
			include: [
				"coolshapes-react",
				"lucide-react",
				"react",
				"react-dom",
				"react/jsx-runtime",
				"gsap",
				"lenis",
				"swiper",
				"sonner",
			],
		},
		ssr: {
			noExternal: ["coolshapes-react"],
		},
		build: {
			cssCodeSplit: true,
			assetsInlineLimit: 4096,
			chunkSizeWarningLimit: 1000,
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (id.includes("node_modules")) {
							if (id.includes("maplibre-gl")) {
								return "vendor-maplibre";
							}
							if (id.includes("react") || id.includes("react-dom") || id.includes("scheduler")) {
								return "vendor-react";
							}
							if (id.includes("gsap") || id.includes("lenis")) {
								return "vendor-animation";
							}
							if (id.includes("swiper") || id.includes("sonner") || id.includes("lucide-react")) {
								return "vendor-ui";
							}
						}
					},
				},
			},
		},
	},

	integrations: [
		react(),
		sitemap(),
		partytown(),
		robotsTxt({
			sitemap: "https://galedicorps.com/sitemap-index.xml",
		}),
	],
});
