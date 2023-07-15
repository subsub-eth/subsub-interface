import type { Meta, StoryObj } from '@storybook/svelte';

import Link from '../lib/components/Link.svelte';

const meta = {
    title: 'Atoms/Link',
    component: Link,
    tags: ['autodocs'],
} satisfies Meta<Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const textLink: Story = {
    args: {
        text: 'This is a Text Link',
        url: 'www.google.com',
    },
}

export const buttonLink: Story = {
    args: {
        text: 'Button Link',
        url: 'www.google.com',
        showAsButton: true,
        primary: true,
    },
}