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
    d="M17.9167 7.08334H2.08333M17.9167 12.9167H2.08333M16.7575 16.7575C15.5975 17.9167 13.7325 17.9167 9.99999 17.9167C6.26833 17.9167 4.40166 17.9167 3.24249 16.7575C2.08333 15.5983 2.08333 13.7325 2.08333 10C2.08333 6.26834 2.08333 4.40168 3.24249 3.24251C4.40166 2.08334 6.26749 2.08334 9.99999 2.08334C13.7317 2.08334 15.5983 2.08334 16.7575 3.24251C17.9167 4.40168 17.9167 6.26751 17.9167 10C17.9167 13.7317 17.9167 15.5983 16.7575 16.7575Z"
    stroke-width="1.25"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
