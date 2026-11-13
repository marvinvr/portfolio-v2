# Vite 8 upgrade verification

Verified on 2026-11-13. The visual baseline remains the pre-upgrade main commit
`063291d211eca62c23c87cbe6b885a846f117c45`; no baseline image was changed for this upgrade.

| Package | Before (locked) | After (pinned) |
| --- | --- | --- |
| vite | 5.4.21 | 8.3.6 |
| @sveltejs/vite-plugin-svelte | 4.0.4 | 7.3.1 |
| @sveltejs/kit | 2.49.2 | 2.70.4 |
| @sveltejs/adapter-node | 5.4.0 | 5.5.8 |
| svelte | 5.45.10 | 5.57.3 |
| svelte-check | 4.3.4 | 4.7.8 |
| vite-imagetools | 6.2.9 | 12.0.1 |
| @sentry/sveltekit | 8.55.0 | 10.78.0 |
| esbuild (explicit CSS minifier) | transitive | 0.28.2 |

Bun 1.3.14 and `bun.lockb` are retained. Every new/changed locked package version
(189, including optional platform packages and the visual tooling) was checked
against npm publication timestamps and clears the inherited seven-day Renovate/Bun
cooldown. The Docker install now also receives `bunfig.toml`. Tailwind 3, PostCSS,
Autoprefixer, and MDsveX remain compatible; no Vitest dependency existed.

## Compatibility fixes

- Sentry 8's release injection produced a cycle between the Svelte namespace and
  Rolldown's runtime export helper: production HTML returned 200 but hydration
  threw `TypeError: e is not a function`. Updating Sentry and its bundler plugin
  resolves this; no chunk-order workaround is used.
- Lightning CSS removed standard `backdrop-filter` declarations, leaving only
  `-webkit-backdrop-filter`. The visual report caught both desktop and mobile
  galaxy panels losing their blur. The client environment explicitly retains
  esbuild CSS minification. SvelteKit overrides the top-level `build.cssMinify`,
  so this setting belongs under `environments.client.build`. JavaScript still
  uses Vite 8's default Rolldown/Oxc toolchain.
- The app had no custom `rollupOptions` or esbuild JavaScript options to migrate.
- Existing check failures were fixed: highlighter JSDoc/null handling, legacy icon
  component types, Whoop key types, reactive page data, event directives,
  self-closing HTML, and modal focusability. The embedded solar-system frame now
  has a title. Focusable, labelled code regions retain keyboard scrolling, with
  an explained Svelte accessibility-warning exception.
- Sitemap generation uses the installed binary through `bun run`, avoiding a
  separate `bunx` executable or package resolution.

## Verification results

- Phase 1: 30 baseline screens reviewed; two consecutive checks against the same
  baseline reported zero changes and zero execution failures. A deliberately
  altered screenshot was correctly rejected, with only that screen in the report.
- `bun install --frozen-lockfile`: passes.
- `bun run check`: zero errors, zero warnings (previously 18 errors/18 warnings).
- `bun run visual check` after upgrading: all 30 screens match the original
  baseline, with zero browser/server errors. The two reported galaxy regressions
  were individually reviewed and fixed. A further offline run with Sentry enabled
  also passes all 30 screens with zero changes/errors.
- `docker build .` using the actual production Dockerfile: passes.
- The resulting production image was started locally with no network, secrets,
  database, or production data. HTTP smoke checks verify 200 responses and rendered
  headings/content for `/`, `/blog`, and all eight published posts; 70 referenced
  assets, post APIs, and the sitemap also pass. Server logs contain only the
  listening message. The smoke container was stopped and removed.
- JavaScript syntax and `git diff --check`: pass. There is no configured lint or
  unit-test script; the Playwright suite supplies the browser/visual tests.

Local build notices remain: missing Sentry upload credentials (uploads are not
exercised), old Browserslist data, Rolldown plugin timings, and Node 26's
`module.register()` deprecation notice from instrumentation. The production Node
24 container starts and serves pages without errors or warnings.

## Build times

Full `bun run build`, including adapter and sitemap, timed with `/usr/bin/time -p`
on the same machine with Bun 1.3.14 / Node 26.13.1. Three sequential samples per
version; the new image cache was moved aside before every upgraded sample to
measure fresh image transformations, as on a fresh production build.

| | Samples (seconds) | Median |
| --- | --- | --- |
| Vite 5 | 10.92, 10.88, 10.78 | 10.88 s |
| Vite 8, final configuration | 7.71, 7.23, 7.14 | 7.23 s |

Median improvement: **33.5%**. The original local `bunx` symlink was broken; the
baseline used a temporary valid symlink to the same Bun binary, without editing
the pre-upgrade application.

Production Docker builds took 26.87 s before and 22.50 s after (single wall-clock
runs including dependency installation and image export, not a controlled
benchmark of bundling alone).
