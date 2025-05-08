import { defineConfig } from 'vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import compileTime from 'vite-plugin-compile-time';

export default defineConfig({
	plugins: [compileTime(), cloudflare()],
});
