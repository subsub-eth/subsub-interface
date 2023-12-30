<script lang="ts" context="module">
  import { zeroAddress } from '$lib/web3/helpers';
  import TokenLogo from '$lib/components/TokenLogo.svelte';

  export const meta = {
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
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
</script>

<Template let:args>
  <TokenLogo {...args} />
</Template>

<Story name="UST" args={{ address: zeroAddress }} />
<Story name="unknown address" args={{ address: '0xa8B52F02108AA5F4B675bDcC973760022D7C6020' }} />
