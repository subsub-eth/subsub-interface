<script lang="ts">
  import { twMerge } from 'tailwind-merge';

  /**
   * Is this the principal call to action on the page?
   */
  export let primary = false;
  /**
   * How large should the button be?
   */
  export let size: 'small' | 'medium' | 'large' = 'medium';
  /**
   * Button contents
   */
  export let label: string = '';

  const getSizeClasses = (size: string) => {
  switch (size) {
    case 'small': {
      return 'px-4 py-2.5';
    }
    case 'large': {
      return 'px-6 py-3';
    }
    default: {
      return 'px-5 py-2.5';
    }
  }
};

  const base = 'cursor-pointer rounded-full border-2 font-bold leading-none inline-block';

  const primaryStyle = 'text-white bg-pink-600 border-pink-600 dark:bg-pink-700 dark:border-pink-700';

  const secondaryStyle = 'text-slate-700 bg-transparent border-slate-700 dark:text-white dark:border-white';

  $: mode = primary ? primaryStyle : secondaryStyle;

</script>

<button
  type="button"
  class={twMerge(base, mode, getSizeClasses(size))}
  on:click
>
  {label}
</button>
