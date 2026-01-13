<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements';

  let { ...props }: SVGAttributes<SVGElement> = $props();
</script>

<svg
  {...props}
  width="20"
  height="20"
  viewBox="0 0 20 20"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M17.9167 10C17.9167 6.26751 17.9167 4.40168 16.7575 3.24251C15.5983 2.08334 13.7317 2.08334 10 2.08334C6.26751 2.08334 4.40168 2.08334 3.24251 3.24251C2.08334 4.40168 2.08334 6.26834 2.08334 10M17.9167 10C17.9167 13.7317 17.9167 15.5983 16.7575 16.7575C15.5983 17.9167 13.7325 17.9167 10 17.9167C6.26834 17.9167 4.40168 17.9167 3.24251 16.7575C2.08334 15.5983 2.08334 13.7325 2.08334 10M17.9167 10H2.08334"
    stroke-width="1.25"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
