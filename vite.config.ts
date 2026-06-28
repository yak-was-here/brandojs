import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
	plugins: [react()],
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "BRandoJS",
			formats: ["es", "cjs"],
			fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
		},
		rollupOptions: {
			external: ["react", "react-dom"],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
				},
			},
		},
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./src/test-setup.ts"],
		exclude: ["node_modules", "src/docs/**", "src/readme/**"],
		coverage: {
			provider: "v8",
			reporter: ["text", "lcov", "clover"],
			reportsDirectory: "./public/coverage",
			exclude: ["src/docs/**", "src/readme/**", "demo/**"],
		},
	},
});
