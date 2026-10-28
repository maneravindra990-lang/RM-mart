import * as esbuild from 'esbuild';
import path from 'path';

async function build() {
  await esbuild.build({
    entryPoints: ['server.ts'],
    bundle: true,
    platform: 'node',
    target: 'node22',
    outfile: 'dist/server.cjs',
    format: 'cjs',
    sourcemap: true,
    minify: false,
    external: ['vite', '@google/genai', 'resend', 'express', 'dotenv'],
  });
  console.log('Server built successfully to dist/server.cjs');
}

build().catch((err) => {
  console.error('Server build failed:', err);
  process.exit(1);
});
