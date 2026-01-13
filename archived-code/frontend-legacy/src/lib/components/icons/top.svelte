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
  <g clip-path="url(#clip0_22_124)">
    <path
      d="M10.8333 9.16666L18.3333 1.66666M18.3333 1.66666H13.88M18.3333 1.66666V6.11999"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M9.99999 1.66666C5.39749 1.66666 1.66666 5.39749 1.66666 9.99999C1.66666 14.6025 5.39749 18.3333 9.99999 18.3333C14.6025 18.3333 18.3333 14.6025 18.3333 9.99999"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    />
  </g>
</svg>
