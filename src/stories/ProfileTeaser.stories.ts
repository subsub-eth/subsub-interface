import type { Meta, StoryObj } from '@storybook/svelte';

import ProfileTeaser from './ProfileTeaser.svelte';

const meta = {
    title: 'Atoms/ProfileTeaser',
    component: ProfileTeaser,
    tags: ['autodocs'],
} satisfies Meta<ProfileTeaser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithImage: Story = {
    args: {
    },
}
