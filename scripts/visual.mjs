import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const mode = process.argv.slice(2).filter((arg) => arg !== '--')[0];
if (!['baseline', 'check'].includes(mode)) {
  console.error('Usage: bun run visual baseline|check (requires Docker)');
  process.exit(1);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const sourceCommit = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' });
if (sourceCommit.status !== 0) throw new Error('Cannot identify the source commit');
mkdirSync(new URL('../visual/baseline/', import.meta.url), { recursive: true });
run('docker', ['build', '--platform=linux/arm64', '-f', 'scripts/visual/Dockerfile', '-t', 'portfolio-visual:local', '.']);
// No network, .env file, database, published ports, or production credentials.
run('docker', ['run', '--rm', '--init', '--network=none', '--shm-size=1g',
  '--platform=linux/arm64', '-e', `VISUAL_SOURCE_COMMIT=${sourceCommit.stdout.trim()}`,
  '-v', `${fileURLToPath(new URL('../visual/', import.meta.url))}:/app/visual`,
  'portfolio-visual:local', mode]);
