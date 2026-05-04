import * as esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['server.ts'],
  bundle: true,
  platform: 'node',
  target: 'node22',
  outfile: 'dist/server.cjs',
  format: 'cjs',
  external: ['express', 'mongoose', 'bcryptjs', 'jsonwebtoken', 'vite']
}).catch(() => process.exit(1));
