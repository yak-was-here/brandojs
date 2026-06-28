## Installation

```bash
npm install {{ pkg.name }}
```

## Quick Start

```tsx
import { BRando, BRandoHandle } from "{{ pkg.name }}";
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

## Imperative Controls (ref)

```ts
ref.current.play()       // resume cycling
ref.current.pause()      // freeze on current background
ref.current.next()       // skip to next background immediately
ref.current.remove()     // tear down and restore original styles
ref.current.isRunning()  // → boolean
ref.current.isRemoved()  // → boolean
```

### ℹ️ Preload Images

> Preload any images used as backgrounds so they are ready before the transition starts:
>
> ```html
> <link rel="preload" href="/images/photo1.jpg" as="image" />
> ```
