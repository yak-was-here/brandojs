import { describe, test, expect, vi, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { createRef } from "react";
import { BRando, BRandoHandle } from "./BRando";
import { bRando } from "./bRando";

afterEach(() => {
	vi.restoreAllMocks();
});

describe("BRando component", () => {
	test("renders a div", () => {
		const { container } = render(<BRando />);
		expect(container.querySelector("div")).toBeTruthy();
	});

	test("renders children", () => {
		render(<BRando><span data-testid="child">hello</span></BRando>);
		expect(screen.getByTestId("child")).toBeTruthy();
	});

	test("applies className", () => {
		const { container } = render(<BRando className="my-bg" />);
		expect(container.querySelector(".my-bg")).toBeTruthy();
	});

	test("applies style", () => {
		const { container } = render(<BRando style={{ height: "100px" }} />);
		const div = container.querySelector("div") as HTMLElement;
		expect(div.style.height).toBe("100px");
	});

	test("sets data-brando attribute", () => {
		const { container } = render(<BRando />);
		const div = container.querySelector("div") as HTMLElement;
		expect(div.getAttribute("data-brando")).toBeTruthy();
	});

	test("exposes imperative handle", () => {
		const ref = createRef<BRandoHandle>();
		render(<BRando ref={ref} />);
		expect(typeof ref.current?.play).toBe("function");
		expect(typeof ref.current?.pause).toBe("function");
		expect(typeof ref.current?.next).toBe("function");
		expect(typeof ref.current?.remove).toBe("function");
		expect(typeof ref.current?.isRunning).toBe("function");
		expect(typeof ref.current?.isRemoved).toBe("function");
	});

	test("isRunning returns true after mount", () => {
		const ref = createRef<BRandoHandle>();
		render(<BRando ref={ref} />);
		expect(ref.current?.isRunning()).toBe(true);
	});

	test("isRemoved returns false after mount", () => {
		const ref = createRef<BRandoHandle>();
		render(<BRando ref={ref} />);
		expect(ref.current?.isRemoved()).toBe(false);
	});

	test("pause and play via ref", () => {
		const ref = createRef<BRandoHandle>();
		render(<BRando ref={ref} />);
		act(() => ref.current?.pause());
		expect(ref.current?.isRunning()).toBe(false);
		act(() => ref.current?.play());
		expect(ref.current?.isRunning()).toBe(true);
	});

	test("next via ref advances background index", () => {
		const ref = createRef<BRandoHandle>();
		render(
			<BRando
				ref={ref}
				backgrounds={["red", "blue", "green"]}
				random={false}
			/>
		);
		act(() => {
			ref.current?.pause();
			ref.current?.next();
		});
		expect(ref.current?.isRemoved()).toBe(false);
	});

	test("removes changer on unmount", () => {
		vi.spyOn(bRando.prototype, "remove");
		const { unmount } = render(<BRando />);
		const styleCountBefore = document.head.querySelectorAll("style").length;
		unmount();
		expect(bRando.prototype.remove).toHaveBeenCalledTimes(1);
		// style element injected by bRando should be removed
		expect(document.head.querySelectorAll("style").length).toBeLessThan(styleCountBefore);
	});

	test("accepts backgrounds prop", () => {
		const ref = createRef<BRandoHandle>();
		render(<BRando ref={ref} backgrounds={["red", "blue"]} />);
		expect(ref.current?.isRunning()).toBe(true);
	});

	test("accepts timeout prop", () => {
		const ref = createRef<BRandoHandle>();
		render(<BRando ref={ref} timeout={3000} />);
		expect(ref.current?.isRunning()).toBe(true);
	});

	test("accepts random=false prop", () => {
		const ref = createRef<BRandoHandle>();
		render(<BRando ref={ref} random={false} />);
		expect(ref.current?.isRunning()).toBe(true);
	});

	test("accepts transition prop", () => {
		const ref = createRef<BRandoHandle>();
		render(<BRando ref={ref} transition="300ms ease" />);
		expect(ref.current?.isRunning()).toBe(true);
	});
});
