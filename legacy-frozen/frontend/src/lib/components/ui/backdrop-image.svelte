<script lang="ts">
  import { cn } from '$lib/functions/classnames';
  import type { Nullable } from '$lib/types/shared';
  import type { Snippet } from 'svelte';

  type Props = Partial<{
    src: Nullable<string>;
    class: string;
    img_class: string;
    backdrop_class: string;
    children: Snippet<[]>;
  }>;

  let { src, class: klass, img_class, backdrop_class, children }: Props = $props();
</script>

<div
  class={cn(
    klass,
    'outline-base-content/15 rounded-box relative flex cursor-pointer justify-center overflow-hidden outline -outline-offset-1'
  )}
>
  <!-- blurred img -->
  <div
    class={cn(
      backdrop_class,
      'absolute inset-0 -z-10 scale-150 bg-cover bg-center opacity-50 blur-xl'
    )}
    style="background-image: url({src});"
  ></div>
  <!-- original img -->
  {#if children}
    {@render children()}
  {:else}
    <img {src} alt="" class={cn(img_class, 'object-contain')} />
  {/if}
</div>
