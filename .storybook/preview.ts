import type { Preview } from '@storybook/svelte';
import { themes } from '@storybook/theming';

import '../src/app.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#0c0a09',
        },
      ],
    },
    docs: {
      theme: themes.dark,
    },
  },
};

export default preview;
