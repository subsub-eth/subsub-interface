<script lang="ts">
  import { twMerge } from 'tailwind-merge';

  type Sizes = 'small' | 'medium' | 'large';

  /**
   * Additional css classes
   */
  interface Props {
    /**
     * Loader size
     */
    size: Sizes;
    class?: string;
  }

  let { size, class: clazz = '' }: Props = $props();

  let base = $derived(
    'box-border inline-block rounded-full border-greyscale-g5 border-s-primary-purple2 animate-spin'
  );

  const fromSize = (size: Sizes) => {
    switch (size) {
      case 'small':
        return 'w-4 h-4 border-2';
      case 'medium':
        return 'w-8 h-8 border-4';
      case 'large':
        return 'w-12 h-12 border-8';
    }
  };
</script>

<span class={twMerge(base, fromSize(size), clazz)}></span>

