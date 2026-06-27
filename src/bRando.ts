/**
 * An interface for options used when initializing a background changer. It is passed to the {@link BRando} component or a {@link bRando} class constructor.
 */
export interface Options {
	/**
	 * Sets the [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) used when selecting elements to change backgrounds on; multiple element selections are supported. e.g. `"main"`
	 * @defaultValue `"body"`
	 */
	CSSSelector?: string;

	/**
	 * Sets an array of [CSS backgrounds](https://developer.mozilla.org/en-US/docs/Web/CSS/background) to be used. e.g. `["red","green","blue"]`
	 * @defaultValue An array of {@link bRando._demoBackgrounds demo CSS backgrounds }
	 */
	backgrounds?: string[];

	/**
	 * Sets the time between background changes (in milliseconds). e.g. `5000`
	 * @remarks
	 * [[include:transition-duration-timeout-warning.md]]
	 * @defaultValue `7500`
	 */
	timeout?: number;

	/**
	 * Sets whether to pick the next background value at random (`true`) or sequentially (`false`).
	 * @defaultValue `true`
	 */
	random?: boolean;

	/**
	 * Sets the [CSS transition](https://developer.mozilla.org/en-US/docs/Web/CSS/transition) (without a [transition-property](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-property)) used when changing between backgrounds. e.g. `"500ms ease-in"` or `"0.5s ease-in-out 0.25s"`
	 * @remarks
	 * [[include:transition-duration-timeout-warning.md]]
	 * @defaultValue `"5000ms"`
	 */
	transition?: string;
}

/**
 * A class for automatically changing CSS backgrounds on any element in a random or sequential order &mdash; a background changer. A usage example can be found in [the readme](https://github.com/yak-was-here/brandojs#-usage).
 * @remarks
 * A background will never repeat (back-to-back) unless only one {@link Options.backgrounds background value} is given.
 */
export class bRando {
	protected readonly _CSSSelector: string = "";
	/**
	 * Returns the [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) used when selecting elements for a background changer. e.g. `"main"`
	 */
	public get CSSSelector(): string {
		return this._CSSSelector;
	}

	protected readonly _nodes: NodeList;
	/**
	 * Returns a [`NodeList`](https://developer.mozilla.org/en-US/docs/Web/API/NodeList) containing every element selected for a background changer.
	 */
	public get nodes(): NodeList {
		return this._nodes;
	}

	protected _backgrounds: string[] = [];
	/**
	 * Returns an array of the background values set for a background changer. e.g. `["red", "green", "blue"]`
	 */
	public get backgrounds(): string[] {
		return this._backgrounds;
	}
	/**
	 * Sets an array of [CSS backgrounds](https://developer.mozilla.org/en-US/docs/Web/CSS/background) to be used. e.g. `["red","green","blue"]`
	 * @defaultValue An array of demo values
	 */
	public set backgrounds(value: string[] | undefined) {
		if (
			Array.isArray(value) &&
			value.every((b) => {
				return typeof b === "string";
			})
		) {
			this._backgrounds = value;
		} else {
			this._backgrounds = this._demoBackgrounds;
		}
	}

	protected _timeout: number = 0;
	/**
	 * Returns the set time between background changes (in milliseconds). e.g. `5000`
	 */
	public get timeout(): number {
		return this._timeout;
	}
	/**
	 * Sets the time between background changes (in milliseconds). e.g. `5000`
	 * @remarks
	 * [[include:transition-duration-timeout-warning.md]]
	 * @defaultValue `7500`
	 */
	public set timeout(value: number | undefined) {
		if (value && value > 0) {
			this._timeout = value;
		} else {
			this._timeout = 7500;
		}
		if (this._changer !== null) {
			this.pause();
			this.play();
		}
	}

	protected _random: boolean = true;
	/**
	 * Returns whether a background changer will randomly (`true`) or sequentially (`false`) pick the next background value.
	 */
	public get random(): boolean {
		return this._random;
	}
	/**
	 * Sets whether to pick the next background value at random (`true`) or sequentially (`false`).
	 * @defaultValue `true`
	 */
	public set random(value: boolean | undefined) {
		this._random = typeof value !== "boolean" ? true : value;
	}

	protected _transition: string = "";
	/**
	 * Returns the [CSS transition](https://developer.mozilla.org/en-US/docs/Web/CSS/transition) (without a [transition-property](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-property)) used when changing between backgrounds. e.g. `"500ms ease-in"` or `"0.5s ease-in-out 0.25s"`
	 */
	public get transition(): string {
		return this._transition;
	}
	/**
	 * Sets the [CSS transition](https://developer.mozilla.org/en-US/docs/Web/CSS/transition) (without a [transition-property](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-property)) used when changing between backgrounds. e.g. `"500ms ease-in"` or `"0.5s ease-in-out 0.25s"`
	 * @remarks
	 * [[include:transition-duration-timeout-warning.md]]
	 * @defaultValue `"5000ms"`
	 */
	public set transition(value: string | undefined) {
		this._transition = typeof value !== "string" ? "5000ms" : value;
	}

	protected readonly _originalCSSBackgrounds: string[] = [];
	protected readonly _originalCSSPositions: string[] = [];
	protected readonly _originalCSSZIndexes: string[] = [];
	protected _changer: number | null = null;
	protected readonly _styleElement: HTMLElement;
	protected _isAfterOpaque: boolean = false;
	protected readonly _CSSBackgroundVarName: string;
	protected readonly _CSSOpacityVarName: string;
	protected readonly _CSSTransitionVarName: string;
	protected readonly _CSSContentVarName: string;

	protected _currentBackgroundIndex: number = -1;
	/**
	 *
	 * Returns the index of the background currently being displayed from the {@link bRando.backgrounds backgrounds array}. Returns `-1` if none of the backgrounds are being displayed.
	 */
	public get currentBackgroundIndex(): number {
		return this._currentBackgroundIndex;
	}

	/**
	 * An array of demo CSS backgrounds. Follow the link below &#x2199; to see the values in the source code.
	 */
	protected readonly _demoBackgrounds: string[] =
		// prettier-ignore
		[
		`url("https://unpkg.com/brandojs/dist/img/alex-knight-vaA6EQiUSo4-unsplash_result.jpg") center/cover no-repeat`, 
		`url("https://unpkg.com/brandojs/dist/img/joel-fulgencio-01fAtHwYqo0-unsplash_result.jpg") center/cover no-repeat`, 
		`url("https://unpkg.com/brandojs/dist/img/pawel-nolbert-4u2U8EO9OzY-unsplash_result.jpg") center/cover no-repeat`, 
		`url("https://unpkg.com/brandojs/dist/img/stephan-valentin-oqYLdbuJDQU-unsplash_result.jpg") center/cover no-repeat`, 
		`url("https://unpkg.com/brandojs/dist/img/waranont-joe-T7qyLNPwgKA-unsplash_result.jpg") center/cover no-repeat`, 
		`linear-gradient(80deg, #0864c8 25%, #588fca 75%)`
	];

	/**
	 * Constructs a background changer and accepts an {@link Options} object. A usage example can be found in [the readme](https://github.com/yak-was-here/brandojs#-usage).
	 *
	 * @remarks
	 * [[include:first-background.md]]
	 */
	constructor(options?: Options) {
		options = options == null ? {} : options;
		this._CSSSelector = typeof options.CSSSelector !== "string" ? "body" : options.CSSSelector;
		this._nodes = document.querySelectorAll(this.CSSSelector);
		this.backgrounds = options.backgrounds;
		this.timeout = options.timeout;
		this.random = options.random;
		this.transition = options.transition;
		this.nodes.forEach((e) => {
			this._originalCSSBackgrounds.push((e as HTMLElement).style.background); // backup the original CSS background property
			this._originalCSSPositions.push((e as HTMLElement).style.position); // backup the original CSS position property
			this._originalCSSZIndexes.push((e as HTMLElement).style.zIndex); // backup the original CSS z-index property
			(e as HTMLElement).style.position = "relative"; // set each element to be relative
		});
		this._styleElement = document.createElement("style");
		this._CSSBackgroundVarName = `--bRandoBg${this.CSSSelector.replace(/[^a-z0-9]/gi, "")}`;
		this._CSSOpacityVarName = `--bRandoOpacity${this.CSSSelector.replace(/[^a-z0-9]/gi, "")}`;
		this._CSSTransitionVarName = `--bRandoTransition${this.CSSSelector.replace(/[^a-z0-9]/gi, "")}`;
		this._CSSContentVarName = `--bRandoContent${this.CSSSelector.replace(/[^a-z0-9]/gi, "")}`;
		this._styleElement.innerText = `${this.CSSSelector}::after{background:var(${this._CSSBackgroundVarName});content:var(${this._CSSContentVarName});position:absolute;top:0;bottom:0;left:0;right:0;z-index:-1;opacity:var(${this._CSSOpacityVarName});transition: var(${this._CSSTransitionVarName});}`;
		document.head.append(this._styleElement);
		this.nodes.forEach((e) => {
			(e as HTMLElement).style.setProperty(this._CSSOpacityVarName, "0");
			(e as HTMLElement).style.setProperty(this._CSSTransitionVarName, `opacity ${this.transition}`);
			(e as HTMLElement).style.setProperty(this._CSSContentVarName, "''");
			(e as HTMLElement).style.zIndex = "0";
		});

		this.next();
		this.play();
	}

	/**
	 * Plays a background changer. This is automatically called when a new background changer is constructed.
	 * @example
	 * ```javascript
	 * bgChanger.pause(); // changer was paused
	 * bgChanger.play(); // resume changer
	 * ```
	 */
	play(): void {
		if (this.isRemoved()) {
			return;
		}
		this.pause();
		this._changer = window.setInterval(() => {
			this.next();
		}, this.timeout);
	}
	/**
	 * Pauses a background changer on the current background. Calling this will not pause any transition animations.
	 * @example
	 * ```javascript
	 * bgChanger.pause();
	 * ```
	 */
	pause(): void {
		if (this._changer !== null) window.clearInterval(this._changer);
		this._changer = null;
	}
	/**
	 * Advances a background changer to the next background in the sequence or at random, depending on the value of {@link bRando.random}.
	 * @example
	 * ```javascript
	 * bgChanger.next();
	 * ```
	 */
	next(): void {
		if (this.isRemoved()) {
			return;
		}
		const getNewRandomBackgroundIndex = (): number => {
			let newIndex: number;
			do {
				newIndex = Math.floor(Math.random() * this.backgrounds.length);
			} while (this.currentBackgroundIndex === newIndex);
			return newIndex;
		};
		// if a changer exists reset it
		if (this._changer !== null) {
			this.play();
		}
		if (this.backgrounds.length > 1) {
			this._currentBackgroundIndex = this.random ? getNewRandomBackgroundIndex() : this.currentBackgroundIndex === this.backgrounds.length - 1 ? (this._currentBackgroundIndex = 0) : this.currentBackgroundIndex + 1;
		} else if (this._currentBackgroundIndex === -1) {
			this._currentBackgroundIndex = 0;
		}

		this.nodes.forEach((e) => {
			(e as HTMLElement).style.setProperty(this._CSSTransitionVarName, `opacity ${this.transition}`);
			if (!this._isAfterOpaque) {
				(e as HTMLElement).style.setProperty(this._CSSBackgroundVarName, this.backgrounds[this.currentBackgroundIndex]);
				(e as HTMLElement).style.setProperty(this._CSSOpacityVarName, "1");
			} else {
				(e as HTMLElement).style.background = this.backgrounds[this.currentBackgroundIndex];
				(e as HTMLElement).style.setProperty(this._CSSOpacityVarName, "0");
			}
		});
		this._isAfterOpaque = !this._isAfterOpaque;
	}
	/**
	 * Removes a background changer from the DOM and restores the selected elements to their state before background changes were made.
	 *
	 * @example
	 * ```javascript
	 * const bgChanger = new bRando(options); // changer created for <body>
	 * bgChanger.remove(); // remove changer from the DOM and <body>
	 * ```
	 */
	remove(): void {
		this.pause();
		this.nodes.forEach((e, i) => {
			// hide pseudo ::after elements
			(e as HTMLElement).style.setProperty(this._CSSOpacityVarName, "0");
			(e as HTMLElement).style.setProperty(this._CSSContentVarName, "none");
			(e as HTMLElement).style.background = this._originalCSSBackgrounds[i]; // restore original CSS background property
			(e as HTMLElement).style.position = this._originalCSSPositions[i]; // restore original CSS position property
			(e as HTMLElement).style.zIndex = this._originalCSSZIndexes[i]; // restore original CSS z-index property
		});
		this._styleElement.remove();
	}
	/**
	 * Returns whether a background changer is playing.
	 * @example
	 * ```javascript
	 * bgChanger.play(); // changer was told to play
	 * bgChanger.isRunning(); // returns true
	 * ```
	 * @returns `true` if running
	 */
	isRunning(): boolean {
		return this._changer !== null;
	}
	/**
	 * Returns whether a background changer has been removed.
	 * @example
	 * ```javascript
	 * bgChanger.remove(); // changer was told to remove itself
	 * bgChanger.isRemoved(); // returns true
	 * ```
	 * @returns `true` if removed
	 */
	isRemoved(): boolean {
		return !this._styleElement.isConnected;
	}
}
