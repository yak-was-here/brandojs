import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { bRando } from "./bRando";

let testInstance: bRando;
const selector = "body";

beforeEach(() => {
	testInstance = new bRando();
});

afterEach(() => {
	testInstance.remove();
	vi.restoreAllMocks();
});

describe("default values are set for", () => {
	test("_changer", () => {
		// @ts-ignore
		expect(testInstance._changer).not.toBeNull();
	});
	test("_isAfterOpaque", () => {
		// @ts-ignore
		expect(typeof testInstance._isAfterOpaque).toBe("boolean");
	});
	test("_currentBackgroundIndex", () => {
		expect(typeof testInstance.currentBackgroundIndex).toBe("number");
	});
});

describe("public setter works as expected for", () => {
	test("backgrounds", () => {
		const spy = vi.spyOn(testInstance, "backgrounds", "set");

		testInstance.backgrounds = [];
		expect(spy).toHaveBeenCalled();
		expect(testInstance.backgrounds.length).toBe(0);

		testInstance.backgrounds = undefined;
		expect(spy).toHaveBeenCalledTimes(2);
		expect(testInstance.backgrounds.length).toBeGreaterThan(0);

		const malformedBgs = ["", 123];
		// @ts-ignore
		testInstance.backgrounds = malformedBgs;
		expect(spy).toHaveBeenCalledTimes(3);
		expect(testInstance.backgrounds).not.toEqual(malformedBgs);
		expect(testInstance.backgrounds.length).toBeGreaterThan(0);
	});
	test("timeout", () => {
		const spy = vi.spyOn(testInstance, "timeout", "set");
		const spyPause = vi.spyOn(testInstance, "pause");
		const spyPlay = vi.spyOn(testInstance, "play");

		testInstance.timeout = 2345;
		expect(spy).toHaveBeenCalled();
		expect(testInstance.timeout).toBe(2345);
		expect(spyPause).toHaveBeenCalled();
		expect(spyPlay).toHaveBeenCalled();

		testInstance.timeout = undefined;
		expect(spy).toHaveBeenCalledTimes(2);
		expect(testInstance.timeout).not.toBe(0);
	});
	test("random", () => {
		const spy = vi.spyOn(testInstance, "random", "set");

		testInstance.random = false;
		expect(spy).toHaveBeenCalled();
		expect(testInstance.random).toBe(false);

		testInstance.random = undefined;
		expect(spy).toHaveBeenCalledTimes(2);
		expect(testInstance.random).toBe(true);
	});
	test("transition", () => {
		const spy = vi.spyOn(testInstance, "transition", "set");

		testInstance.transition = "300ms";
		expect(spy).toHaveBeenCalled();
		expect(testInstance.transition).toBe("300ms");

		testInstance.transition = undefined;
		expect(spy).toHaveBeenCalledTimes(2);
		expect(testInstance.transition.length).toBeGreaterThan(0);
	});
});

describe("public getter works as expected for", () => {
	test("CSSSelector", () => {
		const spy = vi.spyOn(testInstance, "CSSSelector", "get");
		expect(testInstance.CSSSelector.length).toBeGreaterThan(0);
		expect(spy).toHaveReturned();
		expect(spy).toHaveBeenCalled();
	});
	test("nodes", () => {
		const spy = vi.spyOn(testInstance, "nodes", "get");
		expect(testInstance.nodes.length).toBeGreaterThan(0);
		expect(spy).toHaveReturned();
		expect(spy).toHaveBeenCalled();
	});
	test("backgrounds", () => {
		const spy = vi.spyOn(testInstance, "backgrounds", "get");
		expect(testInstance.backgrounds.length).toBeGreaterThan(0);
		expect(spy).toHaveReturned();
		expect(spy).toHaveBeenCalled();
	});
	test("timeout", () => {
		const spy = vi.spyOn(testInstance, "timeout", "get");
		expect(testInstance.timeout).toBeGreaterThan(0);
		expect(spy).toHaveReturned();
		expect(spy).toHaveBeenCalled();
	});
	test("random", () => {
		const spy = vi.spyOn(testInstance, "random", "get");
		expect(testInstance.random).toBe(true);
		expect(spy).toHaveReturned();
		expect(spy).toHaveBeenCalled();
	});
	test("transition", () => {
		const spy = vi.spyOn(testInstance, "transition", "get");
		expect(testInstance.transition.length).toBeGreaterThan(0);
		expect(spy).toHaveReturned();
		expect(spy).toHaveBeenCalled();
	});
	test("currentBackgroundIndex", () => {
		const spy = vi.spyOn(testInstance, "currentBackgroundIndex", "get");
		expect(testInstance.currentBackgroundIndex).toBeGreaterThanOrEqual(-1);
		expect(spy).toHaveReturned();
		expect(spy).toHaveBeenCalled();
	});
});

describe("constructor", () => {
	test("sets _CSSSelector", () => {
		expect(testInstance.CSSSelector).toBe(selector);
	});
	test("sets _nodes", () => {
		expect(testInstance.nodes.length).toBe(1);
		expect(testInstance.nodes[0]).toBeInstanceOf(Node);
		expect(testInstance.nodes[0].nodeName).toBe(selector.toUpperCase());
	});
	test("sets _backgrounds", () => {
		expect(testInstance.backgrounds).toBeInstanceOf(Array<String>);
	});
	test("sets _timeout", () => {
		expect(testInstance.timeout).not.toBe(0);
	});
	test("sets _random", () => {
		expect(testInstance.random).toBe(true);
	});
	test("sets _transition", () => {
		expect(testInstance.transition).not.toBe("");
	});
	test("sets _originalCSSBackgrounds", () => {
		// @ts-ignore
		expect(testInstance._originalCSSBackgrounds).toBeInstanceOf(Array<String>);
	});
	test("sets _originalCSSPositions", () => {
		// @ts-ignore
		expect(testInstance._originalCSSPositions).toBeInstanceOf(Array<String>);
	});
	test("sets _originalCSSZIndexes", () => {
		// @ts-ignore
		expect(testInstance._originalCSSZIndexes).toBeInstanceOf(Array<String>);
	});
	test("sets _CSSBackgroundVarName", () => {
		// @ts-ignore
		expect(testInstance._CSSBackgroundVarName).toBe(`--bRandoBg${selector}`);
	});
	test("sets _CSSOpacityVarName", () => {
		// @ts-ignore
		expect(testInstance._CSSOpacityVarName).toBe(`--bRandoOpacity${selector}`);
	});
	test("sets _CSSTransitionVarName", () => {
		// @ts-ignore
		expect(testInstance._CSSTransitionVarName).toBe(`--bRandoTransition${selector}`);
	});
	test("sets _CSSContentVarName", () => {
		// @ts-ignore
		expect(testInstance._CSSContentVarName).toBe(`--bRandoContent${selector}`);
	});
	test("sets _styleElement", () => {
		// @ts-ignore
		expect(testInstance._styleElement).toBeInstanceOf(HTMLStyleElement);
		// @ts-ignore
		expect(testInstance._styleElement).not.toBe("");
		// @ts-ignore
		expect(testInstance._styleElement.isConnected).toBe(true);
	});
	test("configures ::after of each node", () => {
		testInstance.remove();
		let result = true;

		for (let i = 0; i < 5; i++) {
			document.body.append(document.createElement("p"));
		}
		testInstance = new bRando({ CSSSelector: "p" });

		testInstance.nodes.forEach((n) => {
			const compdStyleCSSTxt = (n as HTMLElement).style.cssText;
			// constructor calls next() immediately so opacity is already 1
			// @ts-ignore
			result = result && (n as HTMLElement).style.zIndex == "0" && compdStyleCSSTxt.includes(`${testInstance._CSSOpacityVarName}: 1`) && compdStyleCSSTxt.includes(`${testInstance._CSSTransitionVarName}: opacity ${testInstance.transition}`) && compdStyleCSSTxt.includes(`${testInstance._CSSContentVarName}: ''`);
		});
		expect(result).toBe(true);
	});
	test("calls play()", () => {
		// @ts-ignore
		expect(testInstance._changer).not.toBeNull();
	});
	test("single background supported", () => {
		testInstance = new bRando({ backgrounds: ["linear-gradient(80deg, #0864c8 25%, #588fca 75%)"] });
		// constructor calls next() immediately so index is already 0
		expect(testInstance.currentBackgroundIndex).toBe(0);
		testInstance.next();
		expect(testInstance.currentBackgroundIndex).toBe(0);
		testInstance.next();
		expect(testInstance.currentBackgroundIndex).toBe(0);
	});
});

describe("play()", () => {
	test("is a function", () => {
		expect(typeof testInstance.play).toBe("function");
	});
	test("returns nothing", () => {
		expect(testInstance.play()).toBe(undefined);
	});
	describe("works as expected", () => {
		test("does not play if isRemoved()", () => {
			const spyIsRemoved = vi.spyOn(testInstance, "isRemoved");
			const spyPause = vi.spyOn(testInstance, "pause");
			testInstance.remove();
			testInstance.play();
			expect(spyIsRemoved).toHaveBeenCalledTimes(1);
			expect(spyIsRemoved).toHaveLastReturnedWith(true);
			expect(spyPause).toHaveBeenCalledTimes(1);
			// @ts-ignore
			expect(testInstance._changer).toBeNull();
		});
		test("pauses and sets up a new changer", () => {
			vi.useFakeTimers();
			vi.spyOn(globalThis, "setInterval");
			testInstance = new bRando();
			const spyPause = vi.spyOn(testInstance, "pause");
			const spyNext = vi.spyOn(testInstance, "next");
			testInstance.play();

			expect(spyPause).toHaveBeenCalledTimes(1);
			expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), testInstance.timeout);
			expect(setInterval).toHaveBeenCalledTimes(2);
			// @ts-ignore
			expect(testInstance._changer).not.toBeNull();
			vi.advanceTimersByTime(testInstance.timeout);
			expect(spyNext).toHaveBeenCalledTimes(1);
			vi.useRealTimers();
		});
	});
});

describe("pause()", () => {
	test("is a function", () => {
		expect(typeof testInstance.pause).toBe("function");
	});
	test("returns nothing", () => {
		expect(testInstance.pause()).toBe(undefined);
	});
	test("works as expected", () => {
		vi.spyOn(globalThis, "clearInterval");
		// @ts-ignore
		let lastChanger = testInstance._changer;
		testInstance.remove();
		expect(clearInterval).toHaveBeenLastCalledWith(lastChanger);
		// @ts-ignore
		expect(testInstance._changer).toBeNull();
	});
});

describe("next()", () => {
	test("is a function", () => {
		expect(typeof testInstance.next).toBe("function");
	});
	test("returns nothing", () => {
		expect(testInstance.next()).toBe(undefined);
	});
	describe("works as expected", () => {
		test("does not go to next if isRemoved()", () => {
			const spy = vi.spyOn(testInstance, "isRemoved");
			let lastBgIndex = testInstance.currentBackgroundIndex;
			testInstance.remove();
			testInstance.next();
			expect(lastBgIndex).toEqual(testInstance.currentBackgroundIndex);
			expect(spy).toHaveBeenCalledTimes(1);
			expect(spy).toHaveLastReturnedWith(true);
		});
		test("::after is displayed", () => {
			const spyNext = vi.spyOn(testInstance, "next");
			const spyPlay = vi.spyOn(testInstance, "play");
			testInstance.pause();
			expect(spyNext).not.toHaveBeenCalled();

			// constructor calls next() immediately so ::after is already displayed
			expect(testInstance.currentBackgroundIndex).not.toBe(-1);
			// @ts-ignore
			expect(testInstance._isAfterOpaque).toBe(true);

			let result = true;
			testInstance.nodes.forEach((n) => {
				const compdStyleCSSTxt = (n as HTMLElement).style.cssText;
				// @ts-ignore
				result = result && compdStyleCSSTxt.includes(`${testInstance._CSSOpacityVarName}: 1`) && compdStyleCSSTxt.includes(`${testInstance._CSSTransitionVarName}: opacity ${testInstance.transition}`) && compdStyleCSSTxt.includes(`${testInstance._CSSBackgroundVarName}: ${testInstance.backgrounds[testInstance.currentBackgroundIndex]}`);
			});
			expect(result).toBe(true);

			let lastBgIndex = testInstance.currentBackgroundIndex;
			testInstance.next();
			expect(spyPlay).not.toHaveBeenCalled();
			expect(spyNext).toHaveBeenCalledTimes(1);
			expect(testInstance.currentBackgroundIndex).not.toBe(lastBgIndex);
			expect(testInstance.currentBackgroundIndex).not.toBe(-1);
			// @ts-ignore
			expect(testInstance._isAfterOpaque).toBe(false); // toggled from true to false
		});
		test("::after is hidden", () => {
			testInstance.pause();
			// constructor already called next() once (::after displayed, isAfterOpaque=true)
			// one more next() transitions to hidden (isAfterOpaque=false, opacity=0)
			let lastBgIndex = testInstance.currentBackgroundIndex;
			testInstance.next();
			expect(testInstance.currentBackgroundIndex).not.toBe(lastBgIndex);

			let result = true;
			testInstance.nodes.forEach((n) => {
				const compdStyleCSSTxt = (n as HTMLElement).style.cssText;
				// @ts-ignore
				result = result && compdStyleCSSTxt.includes(`${testInstance._CSSOpacityVarName}: 0`) && compdStyleCSSTxt.includes(`${testInstance._CSSTransitionVarName}: opacity ${testInstance.transition}`);
			});
			expect(result).toBe(true);
		});
		test("::after toggles consistently", () => {
			for (let i = 0; i < 30; i++) {
				// @ts-ignore
				if (testInstance._isAfterOpaque) {
					// @ts-ignore
					expect((testInstance.nodes[0] as HTMLElement).style.cssText.includes(`${testInstance._CSSOpacityVarName}: 1`)).toBe(true);
				} else {
					// @ts-ignore
					expect((testInstance.nodes[0] as HTMLElement).style.cssText.includes(`${testInstance._CSSOpacityVarName}: 0`)).toBe(true);
				}
				testInstance.next();
			}
		});
		test("changer exists", () => {
			const spyPlay = vi.spyOn(testInstance, "play");
			testInstance.next();
			expect(spyPlay).toHaveBeenCalledTimes(1);
		});
		test("random order backgrounds (barring back-to-backs) is supported", () => {
			let lastIndex = -1;
			for (let i = 0; i < 30; i++) {
				lastIndex = testInstance.currentBackgroundIndex;
				testInstance.next();
				expect(lastIndex).not.toBe(testInstance.currentBackgroundIndex);
			}
		});
		test("sequential order is supported", () => {
			testInstance.pause();
			testInstance.random = false;
			// constructor calls next() immediately so startIndex is already a valid index
			const n = testInstance.backgrounds.length;
			const startIndex = testInstance.currentBackgroundIndex;
			expect(startIndex).toBeGreaterThanOrEqual(0);
			for (let i = 0; i < n; i++) {
				testInstance.next();
				expect(testInstance.currentBackgroundIndex).toBe((startIndex + 1 + i) % n);
			}
		});
		test("one background case is supported", () => {
			testInstance = new bRando({ backgrounds: ["linear-gradient(80deg, #0864c8 25%, #588fca 75%)"] });
			testInstance.pause();
			// constructor calls next() immediately so index is already 0
			expect(testInstance.currentBackgroundIndex).toBe(0);
			testInstance.next();
			expect(testInstance.currentBackgroundIndex).toBe(0);
			testInstance.next();
			expect(testInstance.currentBackgroundIndex).toBe(0);
		});
		test("two background case is supported", () => {
			testInstance = new bRando({ backgrounds: ["linear-gradient(80deg, #0864c8 25%, #588fca 75%)", "white"] });
			let lastIndex = -1;
			for (let i = 0; i < 30; i++) {
				lastIndex = testInstance.currentBackgroundIndex;
				testInstance.next();
				expect(lastIndex).not.toBe(testInstance.currentBackgroundIndex);
			}
		});
	});
});

describe("remove()", () => {
	test("is a function", () => {
		expect(typeof testInstance.remove).toBe("function");
	});
	test("returns nothing", () => {
		expect(testInstance.remove()).toBe(undefined);
	});
	test("works as expected", () => {
		testInstance.remove();
		// @ts-ignore
		expect(testInstance._changer).toBeNull();
		expect(
			Array.from(testInstance.nodes).every(
				(e, index) =>
					// @ts-ignore
					(e as HTMLElement).style.background == testInstance._originalCSSBackgrounds[index] &&
					// @ts-ignore
					(e as HTMLElement).style.position == testInstance._originalCSSPositions[index] &&
					// @ts-ignore
					(e as HTMLElement).style.zIndex == testInstance._originalCSSZIndexes[index]
			)
		).toBe(true);
		// @ts-ignore
		expect(testInstance._styleElement.isConnected).toBe(false);
	});
});

describe("isRunning()", () => {
	test("is a function", () => {
		expect(typeof testInstance.isRunning).toBe("function");
	});
	test("returns a boolean", () => {
		expect(typeof testInstance.isRunning()).toBe("boolean");
	});
	test("works as expected", () => {
		testInstance.pause();
		expect(testInstance.isRunning()).toBe(false);
		testInstance.play();
		expect(testInstance.isRunning()).toBe(true);
	});
});

describe("isRemoved()", () => {
	test("is a function", () => {
		expect(typeof testInstance.isRemoved).toBe("function");
	});
	test("returns a boolean", () => {
		expect(typeof testInstance.isRemoved()).toBe("boolean");
	});
	test("works as expected", () => {
		expect(testInstance.isRemoved()).toBe(false);
		testInstance.remove();
		expect(testInstance.isRemoved()).toBe(true);
	});
});
