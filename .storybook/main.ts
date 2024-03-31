import type { StorybookConfig } from '@storybook/sveltekit';
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-svelte-csf',
    {
      name: '@storybook/addon-styling',
      options: {}
    }
  ],
  framework: {
    name: '@storybook/sveltekit',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  },
  core: {
    disableTelemetry: true
  },
  async viteFinal(config) {
    // Merge custom configuration into the default config
    const { mergeConfig } = await import('vite');

    return mergeConfig(config, {
      // Add dependencies to pre-optimization
      // workaround, see https://github.com/storybookjs/storybook/issues/25256
      assetsInclude: ['/sb-preview/runtime.js'],
    });
  },
};
export default config;
