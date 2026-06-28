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
				const direct = resolve(dir, url.replace(/^\//, ""));
				const withIndex = resolve(dir, url.replace(/^\//, ""), "index.html");

				if (existsSync(direct) && statSync(direct).isFile()) {
					res.setHeader("Content-Type", MIME[extname(direct)] ?? "application/octet-stream");
					res.end(readFileSync(direct));
					return;
				}

				if (existsSync(withIndex) && statSync(withIndex).isFile()) {
					if (!url.endsWith("/")) {
						res.writeHead(301, { Location: url + "/" });
						res.end();
						return;
					}
					res.setHeader("Content-Type", "text/html; charset=utf-8");
					res.end(readFileSync(withIndex));
					return;
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
