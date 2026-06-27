<p align="center">
<img src="src/demo/brandojs-demo-cap.webp" alt="bRando.js demo screencap" width="640" height="auto"/>
</p>

<h1 align="center">bRando.js</h1>
<h2 align="center"><sub>Website background randomizer</sub></h2>

<p align="center">
<a href="https://www.npmjs.com/package/brandojs"><img alt="npm" src="https://img.shields.io/npm/v/brandojs?style=flat-square"></a>
<a href="https://github.com/yak-was-here/brandojs/blob/master/LICENSE"><img alt="License" src="https://img.shields.io/npm/l/brandojs?style=flat-square"></a>
<a href="https://www.npmjs.com/package/brandojs"><img alt="npm downloads" src="https://img.shields.io/npm/dw/brandojs?style=flat-square"/></a>
<a href="https://brandojs.isaacyakl.com/coverage/lcov-report/"><img alt="coverage" src="./src/readme/coverage.svg"/></a>
<a href="https://brandojs.isaacyakl.com"><img alt="Vercel deploy" src="https://img.shields.io/github/deployments/yak-was-here/brandojs/Production?label=site&style=flat-square"/></a>
</p>

<p align="center">
  <b>Automatically change CSS backgrounds on any DOM element in a random or sequential order. Includes a React component.</b>
</p>
<p align="center">
  <b>Compatibility:</b> ✔️ React (React 17, 18, 19+)<br>
  <b>Demo:</b> <a href="https://brandojs.isaacyakl.com">https://brandojs.isaacyakl.com</a>
</p>
<p align="center">
  <a href="https://github.com/yak-was-here"><img alt="GitHub followers" src="https://img.shields.io/github/followers/yak-was-here?style=social"></a><br>
  <sub>Created by <a href="https://github.com/yak-was-here">yak</a></sub>
</p>

---

## Table of Contents

- [Intro](#intro)
- [Approach](#approach)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Props](#props)
- [Imperative Controls (ref)](#imperative-controls-ref)
- [API Documentation](#api-documentation)
- [To-Do](#to-do)
- [Issues](#issues)
- [License](#license)

---

## Intro

Would you like to...

- Randomly change backgrounds on your React app?
- Smoothly rotate through a collection of CSS background images, colors, and/or gradients?
- Control background changes imperatively with `play`, `pause`, `next`, and more?
- Impress your website visitors?

Try out bRando.js!

The bRando.js library provides a React component and an underlying TypeScript class for cycling CSS backgrounds on any element.

---

## Approach

bRando.js utilizes the pseudo-element [::after](https://developer.mozilla.org/en-US/docs/Web/CSS/::after) and [CSS custom properties (variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) to facilitate smooth transitions. Background changer instances follow this approach:

1. Create an `::after` style definition with CSS variables and the chosen transition settings.
2. Set subsequent backgrounds on the selected element(s) and their `::after` in an alternating manner.
3. Toggle the opacity of the `::after` element(s) to fade between the two layers.

---

## Installation

```bash
npm install brandojs
```

---

## Quick Start

```tsx
import { BRando, BRandoHandle } from "brandojs";
import { useRef } from "react";

function Hero() {
  const ref = useRef<BRandoHandle>(null);

  return (
    <BRando
      ref={ref}
      backgrounds={[
        "url('/images/photo1.jpg') center/cover no-repeat",
        "linear-gradient(135deg, #0864c8, #588fca)",
        "rebeccapurple",
      ]}
      timeout={5000}
      transition="800ms ease-in-out"
      style={{ minHeight: "100vh" }}
    >
      <button onClick={() => ref.current?.next()}>Next</button>
      <button onClick={() => ref.current?.pause()}>Pause</button>
      <button onClick={() => ref.current?.play()}>Play</button>
    </BRando>
  );
}
```

Any valid [CSS `background` value](https://developer.mozilla.org/en-US/docs/Web/CSS/background) works — colors, gradients, images, or combinations.

---

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `backgrounds` | `string[]` | demo images | CSS `background` values to cycle through |
| `timeout` | `number` | `7500` | Milliseconds between changes |
| `random` | `boolean` | `true` | Random order vs. sequential |
| `transition` | `string` | `"5000ms"` | CSS transition timing (without `transition-property`) |
| `className` | `string` | — | Applied to the wrapper `<div>` |
| `style` | `CSSProperties` | — | Applied to the wrapper `<div>` |
| `children` | `ReactNode` | — | Rendered inside the background wrapper |

---

## Imperative Controls (ref)

```ts
ref.current.play()       // resume cycling
ref.current.pause()      // freeze on current background
ref.current.next()       // skip to next background immediately
ref.current.remove()     // tear down and restore original styles
ref.current.isRunning()  // → boolean
ref.current.isRemoved()  // → boolean
ref.current.transition = "800ms ease-in-out"  // update transition timing
ref.current.timeout = 3000                     // update interval (ms)
```

> **Preload images** so they are ready before the transition starts:
> ```html
> <link rel="preload" href="/images/photo1.jpg" as="image" />
> ```

---

## API Documentation

[Full documentation](https://brandojs.isaacyakl.com/docs/)

---

## To-Do

### Planned

- Server-side rendering (SSR) support

### Ideas

Ideas that will not be added unless [requested](https://github.com/yak-was-here/brandojs/issues/new/choose).

- Add event hooks: `onChange`, `afterChange`
- Add `previous()` method

Have a feature request? Create a [new issue](https://github.com/yak-was-here/brandojs/issues/new/choose) or write the feature yourself and open a pull request.

---

## Issues

Found a bug? Create a [new issue](https://github.com/yak-was-here/brandojs/issues/new/choose) or propose a fix by creating a pull request.

---

## License

Licensed under [MIT](https://opensource.org/licenses/MIT).
