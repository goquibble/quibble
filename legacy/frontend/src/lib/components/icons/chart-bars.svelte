<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements';

  interface Props extends SVGAttributes<SVGElement> {
    variant: 'all' | 'popular';
  }

  let { variant, ...svg_attrs }: Props = $props();
</script>

{#if variant === 'all'}
  <svg
    {...svg_attrs}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 1.75C11.31 1.75 10.75 2.31 10.75 3V21C10.75 21.3315 10.8817 21.6495 11.1161 21.8839C11.3505 22.1183 11.6685 22.25 12 22.25C12.3315 22.25 12.6495 22.1183 12.8839 21.8839C13.1183 21.6495 13.25 21.3315 13.25 21V3C13.25 2.31 12.69 1.75 12 1.75ZM18 6.75C17.31 6.75 16.75 7.31 16.75 8V21C16.75 21.3315 16.8817 21.6495 17.1161 21.8839C17.3505 22.1183 17.6685 22.25 18 22.25C18.3315 22.25 18.6495 22.1183 18.8839 21.8839C19.1183 21.6495 19.25 21.3315 19.25 21V8C19.25 7.31 18.69 6.75 18 6.75ZM6 10.75C5.31 10.75 4.75 11.31 4.75 12V21C4.75 21.3315 4.8817 21.6495 5.11612 21.8839C5.35054 22.1183 5.66848 22.25 6 22.25C6.33152 22.25 6.64946 22.1183 6.88388 21.8839C7.1183 21.6495 7.25 21.3315 7.25 21V12C7.25 11.31 6.69 10.75 6 10.75Z"
      fill="currentColor"
    />
  </svg>
{:else if variant === 'popular'}
  <svg
    {...svg_attrs}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17 5V20M12 11V20M7 14V20"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>
{/if}
