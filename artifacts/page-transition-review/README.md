# Random page transition

Reference: user-provided `syncopate-loading.html` from Downloads. HTML is not embedded or used as a runtime document/iframe.

## Implementation

- `PageTransition.jsx` contains the React SVG marks, original pose/easing calculations, scoped input lock and Router transition coordinator.
- `PageTransition.css` contains only `.route-loading*` selectors; no page/header/mobile styles are changed.
- `App.jsx` connects the existing Route children to the coordinator. Header, page components, hero and FirstVisitSplash remain unchanged by this task.

Four original SVG types are used, with five copies of one type per transition. The preceding type is excluded from the next random choice. White/pink backgrounds alternate with opposite ink colors.

Original constants are retained: HOP 540ms, STAGGER 280ms, REST 260ms, LIFT 54px, three waves. The complete cycle lasts 5760ms and then stops. The source's endless restart and post-completion wait are omitted. Reduced-motion preference retains the source's static 2400ms behavior. Loading dots follow the original 260ms, zero-to-four-dot cycle.

The outgoing route stays mounted behind an opaque viewport overlay until the animation ends, then the latest destination is mounted. Same-path navigation (including query/hash-only changes) does not start a transition. All Router navigation paths are covered, including header/footer links, Student's programmatic Project navigation and history changes. New navigation during an active transition retargets the destination without changing shape/restarting animation.

## Verification

Chromium browser checks:

- 1440×900: all four SVG variants, five identical marks, 18px size, 12px row gaps, 60px hop headroom, moving dots, fixed type throughout each transition, no consecutive repeats, wheel/touch/key/duplicate-click lock and restoration.
- Header navigation through PROJECT, STUDENT, SYNCOPATE, GUESTBOOK, CURRICULUM, BEHIND and Home: transition completes without document reload or alphabet splash.
- Same-page menu click skips transition. Home logo still reloads and starts only the existing alphabet onboarding.
- 1920×1080: initial Home entry shows alphabet onboarding only; subsequent page changes and return Home show the random loader only.
- 820×1180 and 390×844: centered overlay, unchanged outgoing route until completion, Student card Project link via useNavigate, destination retargeting, stable type and no alphabet splash on returning Home. These checks also cover the reference's reduced-motion behavior.
- No page errors in these checks. Targeted ESLint and production build pass.

Actual elapsed navigation times include destination rendering and browser automation overhead; animation timing itself uses the above original constants. Physical iPad/Safari was not tested here.
