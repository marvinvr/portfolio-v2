import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, readdir, rm } from 'node:fs/promises';
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { fixedTime, whoop, youtube } from './fixtures/data.mjs';

const mode = process.argv[2];
if (!['baseline', 'check'].includes(mode)) throw new Error('Expected baseline or check');
const baseURL = 'http://127.0.0.1:3000';
const baselineDir = '/app/visual/baseline';
const reportDir = '/app/visual/report';
// Ignore antialias-only pixels; 100 materially changed pixels trigger review.
const policy = { threshold: 0.1, includeAA: false, maxDiffPixels: 100 };
const css = `*, *::before, *::after {
  animation: none !important; transition: none !important;
  scroll-behavior: auto !important; caret-color: transparent !important;
}`;
const fonts = `@font-face { font-family: 'Geist'; font-style: normal; font-weight: 100 900;
  src: url('https://visual.invalid/geist.woff2') format('woff2'); }
@font-face { font-family: 'Geist Mono'; font-style: normal; font-weight: 100 900;
  src: url('https://visual.invalid/geist-mono.woff2') format('woff2'); }`;
const captured = new Set();
const changes = [];
const failures = [];
let serverLog = '';
let browser;
let activePage;
let manifest;
let fingerprint;
await mkdir(baselineDir, { recursive: true });
await rm(reportDir, { recursive: true, force: true });
await mkdir(`${reportDir}/actual`, { recursive: true });
await mkdir(`${reportDir}/diff`, { recursive: true });

const app = spawn(process.execPath, ['--require', './scripts/visual/fixed-clock.cjs', './build'], {
  env: { ...process.env, HOST: '127.0.0.1', PORT: '3000', ORIGIN: baseURL },
  stdio: ['ignore', 'pipe', 'pipe'],
});
app.stdout.on('data', (data) => { serverLog += data; });
app.stderr.on('data', (data) => { serverLog += data; });

async function waitForApp() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (app.exitCode !== null) throw new Error(`App exited: ${serverLog}`);
    try {
      const response = await fetch(baseURL);
      if (response.status === 200) return;
    } catch { /* Wait for the listener. */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('App did not become ready within 30 seconds');
}

async function settle(page) {
  await page.addStyleTag({ content: css });
  const settling = page.evaluate(async () => {
    await document.fonts.ready;
    // Chromium may defer native lazy images in inactive carousel slides forever.
    // Load their real URLs without changing layout or replacing application assets.
    for (const image of document.images) image.loading = 'eager';
    // Exercise real lazy-loading instead of replacing image URLs or hiding content.
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight) {
      scrollTo(0, y);
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }
    await Promise.all([...document.images].map(async (image) => {
      if (image.dataset.src && !image.getAttribute('src')) {
        throw new Error(`Lazy image never loaded: ${image.dataset.src}`);
      }
      if (image.getAttribute('src')) {
        await Promise.race([image.decode(), new Promise((_, reject) => setTimeout(() =>
          reject(new Error(`Image did not decode: ${image.outerHTML}`)), 10_000))]);
      }
    }));
    scrollTo(0, 0);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  await Promise.race([settling, new Promise((_, reject) => {
    const timer = setTimeout(() => reject(new Error('Page did not settle within 20 seconds')), 20_000);
    timer.unref();
  })]);
  await page.mouse.move(0, 0);
}

async function capture(page, name, { fullPage = true } = {}) {
  const filename = `${name}.png`;
  if (captured.has(filename)) throw new Error(`Duplicate screen: ${name}`);
  captured.add(filename);
  console.log(`Capturing ${name}`);
  await settle(page);
  const actual = await page.screenshot({ fullPage, animations: 'disabled', caret: 'hide', style: css });
  await writeFile(`${reportDir}/actual/${filename}`, actual);
  if (mode === 'baseline') return;
  let expected;
  try { expected = await readFile(`${baselineDir}/${filename}`); }
  catch { changes.push({ name, pixels: Infinity, reason: 'New screen; baseline missing' }); return; }
  const a = PNG.sync.read(expected);
  const b = PNG.sync.read(actual);
  const width = Math.max(a.width, b.width);
  const height = Math.max(a.height, b.height);
  function padded(image) {
    const result = new PNG({ width, height });
    result.data.fill(255);
    PNG.bitblt(image, result, 0, 0, image.width, image.height, 0, 0);
    return result;
  }
  const diff = new PNG({ width, height });
  const pixels = pixelmatch(padded(a).data, padded(b).data, diff.data, width, height,
    { threshold: policy.threshold, includeAA: policy.includeAA });
  if (pixels > policy.maxDiffPixels || a.width !== b.width || a.height !== b.height) {
    await writeFile(`${reportDir}/diff/${filename}`, PNG.sync.write(diff));
    changes.push({ name, pixels, percent: 100 * pixels / (width * height),
      reason: `${a.width}×${a.height} → ${b.width}×${b.height}` });
  }
}

async function open(page, path, expectedStatus = 200) {
  const response = await page.goto(`${baseURL}${path}`, { waitUntil: 'networkidle' });
  if (response?.status() !== expectedStatus) throw new Error(`${path}: expected ${expectedStatus}, got ${response?.status()}`);
  await page.locator('footer [role="switch"]').waitFor();
  // This client-only action proves Svelte hydrated, not just SSR HTML rendering.
  await page.locator('.space-flow').first().waitFor({ state: 'attached' }).catch(() => {
    if (expectedStatus === 200) throw new Error(`${path}: hydration action missing`);
  });
}

try {
  await waitForApp();
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  fingerprint = {
    browser: browser.version(), platform: `${process.platform}/${process.arch}`,
    fonts: createHash('sha256').update(await readFile('/app/scripts/visual/fixtures/geist.woff2'))
      .update(await readFile('/app/scripts/visual/fixtures/geist-mono.woff2')).digest('hex'),
    fixedTime, locale: 'en-US', timezone: 'UTC', policy,
  };
  if (mode === 'check') {
    manifest = JSON.parse(await readFile(`${baselineDir}/manifest.json`, 'utf8'));
    if (JSON.stringify(manifest.fingerprint) !== JSON.stringify(fingerprint)) {
      throw new Error('Renderer/fixtures/diff policy differ from baseline; review a deliberate baseline update first');
    }
  }
  const postsResponse = await fetch(`${baseURL}/api/posts/list`);
  if (!postsResponse.ok) throw new Error('Post-list API failed');
  const posts = await postsResponse.json();
  if (!posts.length) throw new Error('No published posts found');
  for (const [viewportName, viewport] of Object.entries({
    desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 },
  })) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1,
      locale: 'en-US', timezoneId: 'UTC', reducedMotion: 'reduce', colorScheme: 'light',
      serviceWorkers: 'block', isMobile: viewportName === 'mobile', hasTouch: viewportName === 'mobile' });
    await context.addInitScript(() => {
      let seed = 20260115;
      Math.random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
      window.addEventListener('space:on', () => { seed = 20260115; });
      localStorage.setItem('space-mode', '0');
      localStorage.setItem('space-mode-seen', '1');
    });
    await context.route('**/*', async (route) => {
      const url = new URL(route.request().url());
      if (url.origin === baseURL) {
        if (url.pathname === '/api/whoop/stats') return route.fulfill({ json: whoop });
        if (url.pathname === '/api/youtube') return route.fulfill({ json: youtube });
        return route.continue();
      }
      if (url.hostname === 'fonts.googleapis.com') return route.fulfill({ contentType: 'text/css', body: fonts });
      if (url.hostname === 'visual.invalid') {
        const name = url.pathname.slice(1);
        if (!['geist.woff2', 'geist-mono.woff2'].includes(name)) throw new Error('Unknown font fixture');
        return route.fulfill({ contentType: 'font/woff2', body: await readFile(`/app/scripts/visual/fixtures/${name}`),
          headers: { 'access-control-allow-origin': '*' } });
      }
      // Third-party widgets/analytics are outside the app's contract and never go live.
      if (route.request().resourceType() === 'document') return route.fulfill({ contentType: 'text/html',
        body: '<!doctype html><html><body style="font:16px sans-serif;background:#f3f4f6;color:#4b5563;margin:0;padding:24px">External embed (offline fixture)</body></html>' });
      if (route.request().resourceType() === 'image') return route.fulfill({ contentType: 'image/png',
        body: await readFile('/app/static/og-image.png') });
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
    });
    const page = await context.newPage();
    activePage = page;
    page.setDefaultTimeout(15_000);
    await page.clock.setFixedTime(new Date(fixedTime));
    page.on('pageerror', (error) => failures.push(`${viewportName}: ${error.stack ?? error.message}`));
    page.on('console', (message) => { if (message.type() === 'error') failures.push(`${viewportName}: ${message.text()}`); });
    page.on('response', (response) => {
      if (response.url().startsWith(baseURL) && response.status() >= 500) failures.push(`${response.status()} ${response.url()}`);
    });
    await open(page, '/');
    await page.getByText('Building useful tools with AI', { exact: true }).waitFor();
    // The current homepage hides Whoop; keep its fixture ready if re-enabled.
    if (await page.locator('#whoop-stats').count()) {
      await page.locator('#whoop-stats').getByText(/^Updated /).waitFor();
    }
    await capture(page, `${viewportName}-home`);

    const showcase = page.locator('section').filter({ has: page.getByRole('button', { name: 'Open fullscreen view' }) }).first();
    await showcase.getByRole('button', { name: 'Next image', exact: true }).click();
    await capture(page, `${viewportName}-carousel-next`);
    await showcase.getByRole('button', { name: 'Open fullscreen view' }).click();
    await page.getByRole('dialog').waitFor();
    await capture(page, `${viewportName}-modal`, { fullPage: false });
    await page.getByRole('dialog').getByRole('button', { name: 'Next image', exact: true }).click();
    await capture(page, `${viewportName}-modal-next`, { fullPage: false });
    await page.keyboard.press('Escape');
    if (await page.getByRole('dialog').count()) throw new Error('Escape did not close modal');

    await page.getByRole('link', { name: 'view all posts →', exact: true }).click();
    await page.waitForURL('**/blog');
    await capture(page, `${viewportName}-blog`);
    await page.locator(`a[href="/posts/${posts[0].slug}"]`).first().click();
    await page.waitForURL(`**/posts/${posts[0].slug}`);
    await page.getByRole('heading', { level: 1, name: posts[0].title }).waitFor();
    await capture(page, `${viewportName}-blog-to-post`);
    await page.getByRole('link', { name: 'back', exact: true }).click();
    // A fresh document has no referrer, so this app's back link falls back home.
    await page.waitForURL(`${baseURL}/`);
    for (const post of posts) {
      await open(page, `/posts/${post.slug}`);
      await page.getByRole('heading', { level: 1, name: post.title }).waitFor();
      await capture(page, `${viewportName}-post-${post.slug}`);
    }
    await open(page, '/');
    await page.getByRole('switch', { name: 'Galaxy mode' }).click();
    await page.locator('html.space').waitFor({ state: 'attached' });
    await page.locator('canvas').waitFor();
    await capture(page, `${viewportName}-galaxy`, { fullPage: false });
    await page.getByRole('switch', { name: 'Galaxy mode' }).click();
    if (await page.locator('html.space').count()) throw new Error('Galaxy mode did not switch off');
    await context.close();
  }
  if (mode === 'baseline') {
    if (/\b(?:error|exception|unhandled)\b/i.test(serverLog)) failures.push('Server log contains errors; see server.log');
    if (failures.length) throw new Error('Browser errors prevent accepting a baseline');
    // A failed run must leave the last accepted baseline intact.
    for (const file of captured) {
      await writeFile(`${baselineDir}/${file}`, await readFile(`${reportDir}/actual/${file}`));
    }
    for (const file of await readdir(baselineDir)) {
      if (file.endsWith('.png') && !captured.has(file)) await rm(`${baselineDir}/${file}`);
    }
    await writeFile(`${baselineDir}/manifest.json`, JSON.stringify({ sourceCommit: process.env.VISUAL_SOURCE_COMMIT,
      fingerprint, screens: [...captured].sort() }, null, 2) + '\n');
  } else {
    for (const file of manifest.screens) {
      if (!captured.has(file)) changes.push({ name: file.replace(/\.png$/, ''), pixels: Infinity, reason: 'Screen removed' });
    }
  }
} catch (error) {
  failures.push(error.stack ?? String(error));
  if (activePage && !activePage.isClosed()) {
    await activePage.screenshot({ path: `${reportDir}/failure.png`, fullPage: true }).catch(() => {});
    await writeFile(`${reportDir}/failure.txt`, await activePage.locator('body').innerText().catch(() => '')).catch(() => {});
  }
} finally {
  await browser?.close();
  app.kill('SIGTERM');
  await new Promise((resolve) => { if (app.exitCode !== null) resolve(); else app.once('exit', resolve); });
  await writeFile(`${reportDir}/server.log`, serverLog);
  if (/\b(?:error|exception|unhandled)\b/i.test(serverLog)) failures.push('Server log contains errors; see server.log');
  changes.sort((a, b) => b.pixels - a.pixels || a.name.localeCompare(b.name));
  const lines = ['# Visual regression report', '',
    `Mode: ${mode}. Captured: ${captured.size}. Screens above threshold: ${changes.length}.`, '',
    `Pixel threshold: ${policy.threshold}; antialias pixels excluded; review above ${policy.maxDiffPixels} changed pixels (or any dimension change).`, ''];
  for (const change of changes) {
    lines.push(`## ${change.name}`, '',
      `${Number.isFinite(change.pixels) ? `${change.pixels.toLocaleString('en-US')} changed pixels (${change.percent.toFixed(4)}%). ` : ''}${change.reason}.`, '',
      `[Baseline](../baseline/${change.name}.png) · [Actual](actual/${change.name}.png) · [Diff](diff/${change.name}.png)`, '',
      `![Diff](diff/${change.name}.png)`, '');
  }
  if (!changes.length) lines.push('No screens exceed the threshold.', '');
  if (failures.length) lines.push('## Execution failures', '', ...failures.map((failure) => `\n\`\`\`\n${failure}\n\`\`\`\n`));
  await writeFile(`${reportDir}/report.md`, lines.join('\n'));
  await writeFile(`${reportDir}/results.json`, JSON.stringify({ mode, captured: captured.size, changes, failures }, null, 2) + '\n');
  console.log(`${captured.size} screens; ${changes.length} visual changes; ${failures.length} execution failures. See visual/report/report.md`);
  if (changes.length || failures.length) process.exitCode = 1;
}
