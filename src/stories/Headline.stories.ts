import type { Meta, StoryObj } from '@storybook/svelte';

import Headline from './Headline.svelte';

const meta = {
    title: 'Atoms/Headline',
    component: Headline,
    tags: ['autodocs'],
} satisfies Meta<Headline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Headline1: Story = {
    args: {
        level: 1,
        text: 'Headline Level 1'
    },
}

export const Headline2: Story = {
    args: {
        level: 2,
        text: 'Headline Level 2'
    },
}

export const Headline3: Story = {
    args: {
        level: 3,
        text: 'Headline Level 3'
    },
}

export const Headline4: Story = {
    args: {
        level: 4,
        text: 'Headline Level 4'
    },
}

export const Headline5: Story = {
    args: {
        level: 5,
        text: 'Headline Level 5'
    },
}

export const Headline6: Story = {
    args: {
        level: 6,
        text: 'Headline Level 6'
    },
}