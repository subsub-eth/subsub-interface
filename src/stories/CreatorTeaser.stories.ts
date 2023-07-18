import type { Meta, StoryObj } from '@storybook/svelte';

import CreatorTeaser from './CreatorTeaser.svelte';

const meta = {
    title: 'Atoms/CreatorTeaser',
    component: CreatorTeaser,
    tags: ['autodocs'],
} satisfies Meta<CreatorTeaser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
    args: {
    },
}
