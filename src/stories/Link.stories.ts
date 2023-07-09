import type { Meta, StoryObj } from '@storybook/svelte';

import Link from './Link.svelte';

const meta = {
    title: 'Atoms/Link',
    component: Link,
    tags: ['autodocs'],
} satisfies Meta<Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const buttonLink: Story = {
    args: {
        text: 'This is a link'
    },
}