<!-- Reference: https://css-tricks.com/building-progress-ring-quickly/ -->
<!-- Modfied from skeleton -->
<script lang="ts">
  import { cn } from '$lib/utils';
  import { type Snippet } from 'svelte';

  interface Props {
    /** Sets the progress value between 0 and 100 */
    value?: number;
    children?: Snippet<[]>;
    /** Sets the base stroke width. Scales responsively. */
    stroke?: number; // px
    /** Sets the base font size. Scales responsively. */
    font?: number; // px
    /** Provide classes to set the meter transition styles. */
    transition?: string;

    // Props (styles)
    /** Provide classes to set the width. */
    width?: string;
    /** Provide classes to set meter color. */
    meter?: string;
    /** Provide classes to set track color. */
    track?: string;
    /** Provide classes to set the SVG text fill color. */
    fill?: string;
    // base class
    class?: string;

    // Props A11y
    /** Provide the ARIA labelledby value. */
    labelledby?: string;
  }
  let {
    value = undefined,
    children,
    stroke = 40, // px
    font = 56, // px
    transition = 'transition-[stroke-dashoffset]',
    class: clazz,

    width = 'w-36',
    meter = 'stroke-primary',
    track = 'stroke-muted',
    fill = 'fill-primary',

    labelledby = ''
  }: Props = $props();

  const strokeLinecap: 'butt' | 'round' | 'square' = 'butt';

  // Base Classes
  const cBase = 'progress-radial relative overflow-hidden';
  const cBaseTrack = 'fill-transparent';
  const cBaseMeter = 'fill-transparent -rotate-90 origin-[50%_50%]';

  // Calculated Values
  const baseSize = 512; // px
  const radius: number = baseSize / 2 - stroke / 2;
  let circumference: number = $state(radius);
  let dashoffset: number | undefined = $state();

  // Set Progress Amount
  function setProgress(percent: number) {
    circumference = radius * 2 * Math.PI;
    dashoffset = circumference - (percent / 100) * circumference;
  }

  // On Init
  setProgress(0);

  // Reactive
  $effect(() => {
    // If indeterminate set 25, else set the value
    setProgress(value === undefined ? 25 : value);
  });

  // Reactive
  let classesBase = $derived(cn(cBase, width, clazz ?? ''));
</script>

<figure
  class="progress-radial {classesBase}"
  data-testid="progress-radial"
  role="meter"
  aria-labelledby={labelledby}
  aria-valuenow={value || 0}
  aria-valuetext={value ? `${value}%` : 'Indeterminate Spinner'}
  aria-valuemin={0}
  aria-valuemax={100}
>
  <!-- Draw SVG -->
  <svg
    viewBox="0 0 {baseSize} {baseSize}"
    class="rounded-full"
    class:animate-spin={value === undefined}
  >
    <!-- Track -->
    <circle
      class="progress-radial-track {cn(cBaseTrack, track)}"
      stroke-width={stroke}
      r={radius}
      cx="50%"
      cy="50%"
    />

    <!-- Meter -->
    <circle
      class="progress-radial-meter {cn(cBaseMeter, meter, transition)}"
      stroke-width={stroke}
      r={radius}
      cx="50%"
      cy="50%"
      style:stroke-dasharray="{circumference}
      {circumference}"
      style:stroke-dashoffset={dashoffset}
      stroke-linecap={strokeLinecap}
    />

    <!-- Center Text -->
    {#if value != undefined && value >= 0 && children}
      <text
        x="50%"
        y="50%"
        text-anchor="middle"
        dominant-baseline="middle"
        font-weight="bold"
        font-size={font}
        class="progress-radial-text {fill}"
      >
        {@render children()}
      </text>
    {/if}
  </svg>
</figure>
