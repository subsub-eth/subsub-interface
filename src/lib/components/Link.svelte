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
     * Show link as a fake button
    */
    export let showAsButton: boolean = false;
    /**
     * Is this a fake print button
     */
     export let primary = false;
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

    $: btnMode = primary ? 'btn--primary' : 'btn--secondary';

    $: base = showAsButton ? `btn ${btnMode}` : 'link';

  </script>
  
  <a
    class={twMerge(base, clazz)}
    href={url}
    {...opts}
    >{text}</a
  >
  