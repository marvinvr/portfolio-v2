# Visual regression checks

Requires Bun and Docker. One command builds the production app, starts it in an
isolated container, runs Chromium, and stops everything:

```sh
bun run visual check
```

Before UI-affecting changes or dependency upgrades, use the committed baseline.
After the change, run `check`, open `visual/report/report.md`, and review **every**
reported screen using its baseline, actual, and diff images. Confirm that every
change is intended before pushing. The command exits nonzero for visual changes,
missing/removed screens, browser errors, server errors, or failed interactions.
No lint or unit-test suite exists in this app; this is its browser/visual suite.

To deliberately accept a new reference after reviewing changes:

```sh
bun run visual baseline
bun run visual check
bun run visual check
```

Commit `visual/baseline/` only when both checks report zero changes and the images
have been reviewed. Never regenerate baselines merely to make a dependency
upgrade pass. The initial baseline was taken from main before the Vite 8 upgrade;
`baseline/manifest.json` records the source commit and renderer fingerprint.

The report lists only screens above 100 changed pixels, plus dimension changes
and missing/removed screens, sorted by changed-pixel count. Pixelmatch ignores
antialias-only pixels and uses a perceptual pixel threshold of 0.1. Unchanged
screens are omitted. Actual images, diffs, JSON results, and server logs are local
artifacts under ignored `visual/report/`.

Coverage: homepage, blog, every published post, blog-to-post/back navigation,
showcase carousel, fullscreen modal/next/Escape, galaxy toggle, at 1440×1000 and
390×844. The runner checks 200 responses, hydration, loaded images, and browser
and server errors as well as pixels.

Determinism: pinned Linux arm64 Playwright container/Chromium, bundled OFL Geist
fonts, UTC/en-US, a fixed server/prerender/browser date, seeded randomness, reduced
motion and disabled CSS animations/transitions. API responses for YouTube and
Whoop are fixed Playwright fixtures; external widgets and images are offline
placeholders. All application assets and post content remain real. The runtime
container has **no network**, production credentials, `.env`, or database. It
cannot access production data. Changing the renderer, fonts, clock, or diff policy
requires an explicit baseline review. External service behavior and continuous
animation are outside the visual contract.

Font sources: Google Fonts [Geist](https://fonts.google.com/specimen/Geist) and
[Geist Mono](https://fonts.google.com/specimen/Geist+Mono), bundled with their OFL
licenses in `scripts/visual/fixtures/`.
