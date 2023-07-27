import type { Meta, StoryObj } from '@storybook/svelte';

import Button from '../lib/components/Button.svelte';

// More on how to set up stories at: https://storybook.js.org/docs/svelte/writing-stories/introduction
const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
    },
  },
} satisfies Meta<Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const PrimaryDisabled: Story = {
  args: {
    primary: true,
    label: 'Button',
    isDisabled: true,
  },
};

export const PrimaryLoading: Story = {
  args: {
    primary: true,
    label: 'Button',
    isDisabled: true,
    isLoading: true,
  },
};

export const Secondary: Story = {
  args: {
    label: 'Button',
  },
};

export const SecondaryDisabled: Story = {
  args: {
    label: 'Button',
    isDisabled: true,
  },
};

export const SecondaryLoading: Story = {
  args: {
    label: 'Button',
    isDisabled: true,
    isLoading: true,
  },
};
