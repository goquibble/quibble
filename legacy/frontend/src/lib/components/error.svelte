<script lang="ts">
  import Quibble404 from '$lib/components/vectors/quibble-404.svelte';
  import { cn } from '$lib/functions/classnames';

  type FallbackOptions = Partial<{
    text: string;
    href: string;
    icon: string;
  }>;

  type Props = Partial<{
    class: string;
    head_message: string;
    message: string;
    fallback_options: FallbackOptions;
  }>;

  const { class: _class, head_message, message, fallback_options }: Props = $props();
</script>

<div class={cn(_class, 'flex flex-1 items-end justify-center gap-5')}>
  <Quibble404 class="h-auto w-28" />
  <div class="flex flex-col">
    <h4 class="text-error text-xl font-bold">{head_message ?? 'oops!!'}</h4>
    <!-- eslint-disable svelte/no-at-html-tags -->
    <h5 class="text-sm">{@html message ?? 'Not Found!'}</h5>
    <a
      href={fallback_options?.href ?? '/'}
      aria-label={fallback_options?.text ?? 'home'}
      class="btn btn-primary btn-sm mt-2 w-max"
    >
      {@html fallback_options?.icon ??
        '<coreicons-shape-home class="size-4"></coreicons-shape-home>'}
      {fallback_options?.text ?? 'Back to home'}
    </a>
  </div>
</div>
