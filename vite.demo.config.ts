import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { resolve, extname } from "path";
import { existsSync, statSync, readFileSync } from "fs";

const MIME: Record<string, string> = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript",
	".cjs": "text/javascript",
	".css": "text/css",
	".svg": "image/svg+xml",
	".json": "application/json",
	".png": "image/png",
	".jpg": "image/jpeg",
	".webp": "image/webp",
	".gif": "image/gif",
	".ico": "image/x-icon",
	".woff2": "font/woff2",
	".woff": "font/woff",
};

function serveDir(dir: string): Plugin {
	return {
		name: "serve-dir",
		configureServer(server) {
			server.middlewares.use((req, res, next) => {
				const url = (req.url ?? "/").split("?")[0];
				const candidates = [
					resolve(dir, url.replace(/^\//, "")),
					resolve(dir, url.replace(/^\//, ""), "index.html"),
				];
				for (const candidate of candidates) {
					if (existsSync(candidate) && statSync(candidate).isFile()) {
						res.setHeader("Content-Type", MIME[extname(candidate)] ?? "application/octet-stream");
						res.end(readFileSync(candidate));
						return;
					}
				}
				next();
			});
		},
	};
}

export default defineConfig({
	plugins: [react(), serveDir(resolve(__dirname, "public"))],
	root: resolve(__dirname, "demo"),
	publicDir: resolve(__dirname, "src/demo"),
	build: {
		outDir: resolve(__dirname, "public"),
		emptyOutDir: false,
	},
	server: {
		port: 4000,
		open: true,
	},
	preview: {
		port: 4000,
		open: true,
	},
});
