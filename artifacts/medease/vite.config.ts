import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const port = Number(process.env.PORT ?? 5173);
const basePath = process.env.BASE_PATH ?? '/';
const src = path.resolve(import.meta.dirname, 'src');

export default defineConfig({
  base: basePath,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: '@/app', replacement: path.join(src, 'app') },
      { find: '@/shared', replacement: path.join(src, 'shared') },
      { find: '@/features', replacement: path.join(src, 'features') },
      { find: '@/services', replacement: path.join(src, 'services') },
      { find: '@/config', replacement: path.join(src, 'config') },
      { find: '@/types', replacement: path.join(src, 'types') },
      { find: '@/assets', replacement: path.join(src, 'assets') },
      { find: '@/styles', replacement: path.join(src, 'styles') },
      { find: '@/lib', replacement: path.join(src, 'shared/lib') },
      { find: '@/hooks', replacement: path.join(src, 'shared/hooks') },
      { find: '@', replacement: src },
      {
        find: '@assets',
        replacement: path.resolve(
          import.meta.dirname,
          '..',
          '..',
          'attached_assets',
        ),
      },
    ],
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: false,
    host: true,
  },
  preview: {
    port,
    host: true,
  },
});
