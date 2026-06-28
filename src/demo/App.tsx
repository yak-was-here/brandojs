import { useRef } from "react";
import { marked } from "marked";
import { BRando, BRandoHandle } from "../BRando";
import introRaw from "./intro.md?raw";
import installationUsageRaw from "./installation-usage.md?raw";

const PKG_VARS: Record<string, string> = {
	"pkg.name": "brandojs",
	"pkg.details.stylizedName": "bRando",
	"screencap.src": "./brandojs-demo-cap.webp",
	"screencap.width": "640",
};

function renderMd(raw: string): string {
	const replaced = raw.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (match, key) => PKG_VARS[key] ?? match);
	return marked.parse(replaced) as string;
}

const BACKGROUNDS = [
	`url("/img/alex-knight-vaA6EQiUSo4-unsplash_result.jpg") center/cover no-repeat`,
	`url("/img/joel-fulgencio-01fAtHwYqo0-unsplash_result.jpg") center/cover no-repeat`,
	`url("/img/pawel-nolbert-4u2U8EO9OzY-unsplash_result.jpg") center/cover no-repeat`,
	`url("/img/stephan-valentin-oqYLdbuJDQU-unsplash_result.jpg") center/cover no-repeat`,
	`url("/img/waranont-joe-T7qyLNPwgKA-unsplash_result.jpg") center/cover no-repeat`,
	`linear-gradient(80deg, #0864c8 25%, #588fca 75%)`,
];

export function App() {
	const ref = useRef<BRandoHandle>(null);

	return (
		<BRando ref={ref} backgrounds={BACKGROUNDS} style={{ minHeight: "100vh" }}>
			<main>
				<div className="desc">
					<h1>bRando.js</h1>
					<h2 className="subtitle">Website background randomizer</h2>
					<p>Automatically change CSS backgrounds on any DOM element in a random or sequential order. Includes a React component.</p>
					<hr />
					<p>
						📖&nbsp;<a href="https://github.com/yak-was-here/brandojs">Readme</a><br />
						📓&nbsp;<a href="/docs/">API documentation</a>
					</p>
					<p>
						Created by <a href="https://www.isaacyakl.com" title="yak's Website">yak</a>
					</p>
					<h2>Demo</h2>
					<p>
						<button className="control" onClick={() => ref.current?.next()}>.next()</button>
						<button className="control" onClick={() => ref.current?.pause()}>.pause()</button>
						<button className="control" onClick={() => ref.current?.play()}>.play()</button>
						<br />
						<button className="control" onClick={() => { if (ref.current) ref.current.transition = "500ms ease-in"; }}>.transition = "500ms ease-in"</button>
						<button className="control" onClick={() => { if (ref.current) ref.current.timeout = 5000; }}>.timeout = 5000</button>
						<button className="control" onClick={() => { if (ref.current) ref.current.timeout = 10000; }}>.timeout = 10000</button>
					</p>
				</div>
				<div className="highlight" />
				<div
					className="info"
					dangerouslySetInnerHTML={{ __html: renderMd(introRaw) + renderMd(installationUsageRaw) }}
				/>
			</main>
		</BRando>
	);
}
