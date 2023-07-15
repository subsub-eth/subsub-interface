<script lang="ts">
    import { twMerge } from 'tailwind-merge';
  
    /**
     * Link text 
     */
    export let text: string;
    /**
     * Href url of the link
     */
    export let url: string;
    /**
     * If the link should open a new window
     */
    export let newWindow: boolean = false
    /**
     * Additional css classes
     */
    let clazz: string = '';
    export { clazz as class };
  
    let opts: any;
    $: {
      opts = {};
      if (newWindow) opts.target = "_blank";
    }

    const base = 'cursor-pointer rounded-lg py-2 px-6 border-1 inline-block';
  </script>
  
  <a
    class={twMerge(base, clazz)}
    href={url}
    {...opts}
    >{text}</a
  >
  