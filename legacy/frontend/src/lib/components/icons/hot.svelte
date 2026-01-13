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
    d="M16.0583 13.5017C15.563 14.6866 14.7283 15.6985 13.6591 16.4099C12.59 17.1214 11.3342 17.5007 10.05 17.5C6.45582 17.5 3.54166 14.59 3.54166 11C3.54166 7.41 4.90832 5.94167 7.04582 2.5C11.0508 4.25 11.0508 9.5 11.0508 9.5C11.0508 9.5 12.3667 6.96833 15.0567 5.75C15.9183 8.285 17.0817 11.0542 16.0583 13.5017Z"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <path
    d="M9.99998 15C8.89491 15 7.8351 14.561 7.0537 13.7796C6.2723 12.9982 5.83331 11.9384 5.83331 10.8333"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
