# MOTION.md — Animation Spec 🔥

Good Food. Great Vibes. Every animation must feel **flame-kissed, saucy, and alive — never stiff.**

All timings/easings live in [`lib/motion-presets.ts`](lib/motion-presets.ts) so the whole app is tuned from one kitchen. **Accessibility:** `useReducedMotionSafe()` swaps every entrance/transform for a 300ms simple fade (`fadeOnly`) when `prefers-reduced-motion` is on. `canvas-confetti` uses `disableForReducedMotion: true` globally.

## Easing philosophy
- **Entrances:** springs with overshoot bounce (0.25–0.55), 0.45–0.8s.
- **Micro-interactions:** snappy 150–300ms ease-outs.
- **Exits:** shorter and simpler than entrances (fade/slide, 0.25–0.3s). Never spring out.

## Inventory

| Where | Animation | Preset / Values | Trigger |
|---|---|---|---|
| Hero headline | Per-word drop from `y:-48`, `rotate:-4deg` → 0 | `wordDrop` — spring bounce 0.55, 0.8s, stagger 120ms/word | mount |
| Hero background | Flame gradient (burnt→honey) + drifting canvas embers | `components/motion/embers.tsx` — continuous rAF, ~40 particles, slow upward drift | always (paused for reduced motion) |
| Hero starburst | Slow rotate + soft pulse behind logo | CSS keyframes (`globals.css`) | always |
| Hero food imagery | Parallax translate on mouse move | mouse position → spring-smoothed offsets | pointer move |
| Nav logo | Subtle bob | `animate-logo-bob` CSS keyframe, ~3s loop | always |
| Menu cards | Lift + scale from `y:40, scale:.94` + shadow bloom | `cardIn` — spring bounce 0.3, 0.7s; `stagger(0.08s)` container | `whileInView` (once) |
| Card hover | Image zoom 1.08×, sauce splatter bursts, price wiggle | CSS `scale(1.08)` on img; `wiggle` — rotate `[0,-6,5,-3,0]` 0.45s | hover |
| Add to cart | Icon → "Added ✓" morph + brand-colored confetti burst | state swap + `confettiBurst` (40 particles, spread 55, brand palette) | click |
| Filter tabs | Sliding "pill" indicator | `layoutId` shared layout, `springPill` — bounce 0.25, 0.6s | tab change |
| Cart drawer | Slides from right, item rows stagger in, subtotal counts up | `drawerSlide` — spring bounce 0.1, 0.55s; `rowIn` per row; `CountUp` digits | open |
| Buttons | Magnetic hover; squash-and-stretch tap | cursor-relative spring offset; `tapSquash` — scale `[1,.94,1.06,1]` 0.3s | hover / tap |
| Toasts | Slide + spring in from right, ring progress auto-dismiss | `toastIn` — spring bounce 0.4, 0.5s; 0.25s exit | toast event |
| Checkout → Stripe | Burnt-sienna curtain wipe (full-screen `y:100%→0`) | spring bounce 0.1, 0.7s, then redirect | before redirect |
| Order confirmation | Confetti cannon (60°/120° dual blast), checkmark stroke draw, receipt unrolls from top | `confettiCannon` (90 particles); circle 0.6s then tick 0.5s (`pathLength` 0→1); receipt springs from `y:-60` | mount |
| Scroll story (About) | Pinned GSAP ScrollTrigger: wrap assembles (ingredients fly in) → grill marks → salted chips → frosted cupcake; stats count up | GSAP timeline scrubbed to scroll, pinned panel; `CountUp` on enter | scroll |
| Page transitions | Sauce-splat wipe between routes | `AnimatePresence` + `Splat` SVG scale/blot, 0.45s | route change |
| Loading | Sizzling pan spinner + rising steam | `SizzleSpinner` — CSS keyframes | suspense/loading |
| Skeletons | Honey shimmer sweep | CSS `shimmer` keyframe | data pending |
| Admin kanban | Cards spring in/out and `layout`-animate between columns | spring bounce 0.25, 0.45s | order status change |
| Admin editor modal | Springs up from `y:40, scale:.95` | spring bounce 0.25, 0.5s | open |

## Rules of thumb
1. Springs for entrances, ease-out for hovers, short fades for exits.
2. Brand palette in every confetti: `#BF4C00`, `#FFBE00`, `#7C2B00`, `#FFFFFF`.
3. Nothing blocks interaction — pointer-events pass through decorative layers.
4. Reduced motion = simple fades, zero confetti, no scroll pinning (GSAP falls back to visible final states).
5. If it doesn't make you hungry, redo it. 🔥
