import type { Meta, StoryObj } from '@storybook/svelte';

import Loading from '../lib/components/Loading.svelte';

const meta = {
    title: 'Atoms/Loading',
    component: Loading,
    tags: ['autodocs'],
} satisfies Meta<Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SmallSpinner: Story = {
    args: {
        size: 'small',
    },
}

export const MediumSpinner: Story = {
    args: {
        size: 'medium',
    },
}

export const LargeSpinner: Story = {
    args: {
        size: 'large',
    },
}
