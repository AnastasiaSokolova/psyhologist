import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Served from the domain root on Cloudflare Pages. Absolute asset URLs keep the SPA fallback
  // (unknown paths → index.html) working for any path depth.
  base: '/',
});
