// Fails if any source file outside the generated token layer uses a raw hex colour,
// rgb()/hsl() colour, or a raw px value.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../src/', import.meta.url));
const skip = new Set(['tokens.css', 'tokens.json']);
const bad = [];
const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (['.css', '.jsx', '.js'].includes(extname(f)) && !skip.has(f)) {
      readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
        if (line.includes('lint-allow-px')) return;
        if (/#[0-9a-fA-F]{3,8}\b/.test(line) || /\b(rgba?|hsla?)\(/.test(line) || /\b\d+(\.\d+)?px\b/.test(line))
          bad.push(`${p.replace(root, 'src/')}:${i + 1}: ${line.trim()}`);
      });
    }
  }
};
walk(root);
if (bad.length) { console.error(bad.join('\n')); process.exit(1); }
console.log('lint:tokens ok — no raw hex, rgb() or px outside tokens.css');
