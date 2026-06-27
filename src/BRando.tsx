import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { bRando, Options } from "./bRando";

/**
 * Props for the {@link BRando} React component.
 *
 * Extends all {@link Options} fields except `CSSSelector` (the component manages
 * its own selector internally via a unique `data-brando` attribute).
 */
export interface BRandoProps extends Omit<Options, "CSSSelector"> {
	/** Content rendered inside the background wrapper `<div>`. */
	children?: React.ReactNode;
	/** CSS class name applied to the wrapper `<div>`. */
	className?: string;
	/** Inline styles applied to the wrapper `<div>`. */
	style?: React.CSSProperties;
}

/**
 * Imperative handle exposed via `ref` on a {@link BRando} component.
 *
 * @example
 * ```tsx
 * const ref = useRef<BRandoHandle>(null);
 * <BRando ref={ref} backgrounds={["red", "blue"]} />
 *
 * ref.current.pause();
 * ref.current.next();
 * ref.current.play();
 * ```
 */
export interface BRandoHandle {
	/** Resume cycling through backgrounds. */
	play: () => void;
	/** Freeze on the current background. Does not interrupt transition animations. */
	pause: () => void;
	/** Immediately advance to the next background. */
	next: () => void;
	/** Remove the background changer and restore the element's original styles. */
	remove: () => void;
	/** Returns `true` if the changer is actively cycling. */
	isRunning: () => boolean;
	/** Returns `true` if the changer has been removed. */
	isRemoved: () => boolean;
	/** Get or set the CSS transition timing (e.g. `"800ms ease-in-out"`). */
	transition: string;
	/** Get or set the milliseconds between background changes. */
	timeout: number;
}

let instanceCount = 0;

/**
 * A React component that automatically cycles CSS backgrounds on its wrapper
 * `<div>` in a random or sequential order.
 *
 * Wraps the {@link bRando} class and keeps the underlying instance in sync with
 * prop changes. The changer is automatically removed when the component unmounts.
 *
 * An imperative {@link BRandoHandle} can be obtained via `ref` to call
 * `play`, `pause`, `next`, `remove`, `isRunning`, and `isRemoved` directly.
 *
 * @example
 * ```tsx
 * import { BRando, BRandoHandle } from "brandojs";
 * import { useRef } from "react";
 *
 * function Hero() {
 *   const ref = useRef<BRandoHandle>(null);
 *
 *   return (
 *     <BRando
 *       ref={ref}
 *       backgrounds={["red", "url('/hero.jpg') center/cover", "linear-gradient(135deg,#0f2,#08f)"]}
 *       timeout={5000}
 *       random={true}
 *       transition="800ms ease-in-out"
 *       style={{ height: "100vh" }}
 *     >
 *       <h1>My Site</h1>
 *     </BRando>
 *   );
 * }
 * ```
 */
export const BRando = forwardRef<BRandoHandle, BRandoProps>(function BRando(
	{ children, className, style, backgrounds, timeout, random, transition },
	ref
) {
	const containerRef = useRef<HTMLDivElement>(null);
	const changerRef = useRef<bRando | null>(null);
	const idRef = useRef(`brando-${++instanceCount}`);

	useImperativeHandle(ref, () => {
		const handle = {
			play: () => changerRef.current?.play(),
			pause: () => changerRef.current?.pause(),
			next: () => changerRef.current?.next(),
			remove: () => changerRef.current?.remove(),
			isRunning: () => changerRef.current?.isRunning() ?? false,
			isRemoved: () => changerRef.current?.isRemoved() ?? true,
			get transition() {
				return changerRef.current?.transition ?? "5000ms";
			},
			set transition(v: string) {
				if (changerRef.current) changerRef.current.transition = v;
			},
			get timeout() {
				return changerRef.current?.timeout ?? 7500;
			},
			set timeout(v: number) {
				if (changerRef.current) changerRef.current.timeout = v;
			},
		};
		return handle;
	});

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		el.setAttribute("data-brando", idRef.current);
		const selector = `[data-brando="${idRef.current}"]`;

		changerRef.current = new bRando({
			CSSSelector: selector,
			backgrounds,
			timeout,
			random,
			transition,
		});

		return () => {
			changerRef.current?.remove();
			changerRef.current = null;
		};
	}, []);

	useEffect(() => {
		if (changerRef.current) changerRef.current.backgrounds = backgrounds;
	}, [backgrounds]);

	useEffect(() => {
		if (changerRef.current) changerRef.current.timeout = timeout;
	}, [timeout]);

	useEffect(() => {
		if (changerRef.current) changerRef.current.random = random;
	}, [random]);

	useEffect(() => {
		if (changerRef.current) changerRef.current.transition = transition;
	}, [transition]);

	return (
		<div ref={containerRef} className={className} style={style}>
			{children}
		</div>
	);
});
