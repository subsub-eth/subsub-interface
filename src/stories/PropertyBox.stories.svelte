<script lang="ts" context="module">
  import PropertyBox from '$lib/components/ui/PropertyBox.svelte';

  export const meta = {
    title: 'PropertyBox',
    component: PropertyBox,
    tags: ['autodocs'],
    args: {
      title: "My Property",
      value: "12345",
      subValue: "per Month",
    },
    argTypes: {
      // address: {
      //   control: 'text',
      //   description: 'Address of the subscription contract',
      //   type: {
      //     required: true,
      //     name: 'string'
      //   }
      // },
      // metadata: {
      //   control: 'object',
      //   description: 'Metadata object provided by Contract contractURI method',
      //   type: {
      //     required: true,
      //     name: 'object',
      //     value: {}
      //   }
      // }
    }
  };
</script>

<script lang="ts">
  import { Story, Template } from '@storybook/addon-svelte-csf';
  import { PauseCircle } from 'lucide-svelte';
</script>

<Template let:args>
  <PropertyBox {...args} titleLogo={PauseCircle}/>
</Template>

<Story name="Default" />
