<script lang="ts" module>
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf';
  import { zeroAddress } from '$lib/web3/helpers';
  import TokenLogo from '$lib/components/TokenLogo.svelte';
  import type { Props } from '$lib/components/TokenLogo.svelte';

  const { Story } = defineMeta({
    title: 'TokenLogo',
    component: TokenLogo,
    tags: ['autodocs'],
    args: {
      address: zeroAddress,
      fallbackSymbol: 'TEST'
    },
    argTypes: {
      address: {
        control: 'text',
        description: 'Address of the token contract',
        type: {
          required: true,
          name: 'string'
        }
      },
      fallbackSymbol: {
        control: 'text',
        description: 'Fallback symbol of the token',
        type: {
          required: true,
          name: 'string'
        }
      }
    }
  });
</script>

<script lang="ts">
  // @ts-expect-error load function might be undefined due to Partial
  setTemplate(template);
</script>

{#snippet template(args: Props)}
  <TokenLogo {...args} />
{/snippet}

<Story name="UST" args={{ address: zeroAddress }} />
<Story name="unknown address" args={{ address: '0xa8B52F02108AA5F4B675bDcC973760022D7C6020' }} />
