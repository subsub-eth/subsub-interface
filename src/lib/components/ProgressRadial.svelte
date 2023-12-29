<!-- Reference: https://css-tricks.com/building-progress-ring-quickly/ -->
<!-- Modfied from skeleton -->
<script lang="ts">
  import { cn } from '$lib/utils';
  import { afterUpdate } from 'svelte';

  export let value: number | undefined = undefined;
  /** Sets the base stroke width. Scales responsively. */
  export let stroke = 40; // px
  /** Sets the base font size. Scales responsively. */
  export let font = 56; // px
  /** Provide classes to set the meter transition styles. */
  export let transition = 'transition-[stroke-dashoffset]';

  // Props (styles)
  /** Provide classes to set the width. */
  export let width = 'w-36';
  /** Provide classes to set meter color. */
  export let meter = 'stroke-primary';
  /** Provide classes to set track color. */
  export let track = 'stroke-muted';
  /** Provide classes to set the SVG text fill color. */
  export let fill = 'fill-token';

  // Props A11y
  /** Provide the ARIA labelledby value. */
  export let labelledby = '';

  const strokeLinecap: 'butt' | 'round' | 'square' = 'butt';

  // Base Classes
  const cBase = 'progress-radial relative overflow-hidden';
  const cBaseTrack = 'fill-transparent';
  const cBaseMeter = 'fill-transparent -rotate-90 origin-[50%_50%]';

  // Calculated Values
  const baseSize = 512; // px
  const radius: number = baseSize / 2 - stroke / 2;
  let circumference: number = radius;
  let dashoffset: number;

  // Set Progress Amount
  function setProgress(percent: number) {
    circumference = radius * 2 * Math.PI;
    dashoffset = circumference - (percent / 100) * circumference;
  }

  // On Init
  setProgress(0);

  // Reactive
  afterUpdate(() => {
    // If indeterminate set 25, else set the value
    setProgress(value === undefined ? 25 : value);
  });

  // Reactive
  $: classesBase = cn(cBase, width, $$props.class ?? '');
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
    {#if value != undefined && value >= 0 && $$slots.default}
      <text
        x="50%"
        y="50%"
        text-anchor="middle"
        dominant-baseline="middle"
        font-weight="bold"
        font-size={font}
        class="progress-radial-text {fill}"><slot /></text
      >
    {/if}
  </svg>
</figure>
