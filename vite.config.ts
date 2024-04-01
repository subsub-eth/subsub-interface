import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

import { nodePolyfills as vitePluginNodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    sveltekit(),
    vitePluginNodePolyfills({
      // exclude: ['dns' /** vinejs wants this even though we are not using vine */],
      protocolImports: true
    })
  ],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  }
});
