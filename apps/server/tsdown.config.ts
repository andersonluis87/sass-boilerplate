import { defineConfig } from "tsdown";

export default defineConfig({
	entry: "./src/http/server.ts",
	format: "esm",
	outDir: "./dist",
	clean: true,
	deps: {
		alwaysBundle: [/@sass-boiler-plate\/.*/],
	},
});
