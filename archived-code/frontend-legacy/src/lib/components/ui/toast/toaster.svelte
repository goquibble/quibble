<script lang="ts">
  import { cn } from '$lib/functions/classnames';
  import { toasts_store, type ToastType } from './toast.svelte';
  import { scale } from 'svelte/transition';

  // internal types
  type Props = {
    inside_modal?: boolean;
  };

  let { inside_modal = false }: Props = $props();

  const alert_types: Record<ToastType, string> = {
    default: '',
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error'
  };

  const close_btn_types: Record<ToastType, string> = {
    default: '',
    info: 'btn-info',
    success: 'btn-success',
    warning: 'btn-warning',
    error: 'btn-error'
  };
</script>

<div class="toast toast-center toast-bottom z-999">
  {#each toasts_store.value.filter((t) => t.inside_modal === inside_modal) as t (t.id)}
    <div
      out:scale={{ start: 0.95 }}
      class={cn(
        alert_types[t.type as ToastType],
        'alert flex w-max items-center gap-2 self-center rounded-2xl border-none p-2.5 pl-3 text-xs sm:text-sm'
      )}
    >
      <coreicons-shape-info class="hidden sm:flex"></coreicons-shape-info>
      <span>{t.message}</span>
      <button
        class={cn(
          close_btn_types[t.type as ToastType],
          'btn btn-square btn-xs hidden rounded-lg sm:flex'
        )}
        aria-label="Close toast"
        onclick={() => toasts_store.dismiss(t.id)}
      >
        <coreicons-shape-x variant="no-border"></coreicons-shape-x>
      </button>
    </div>
  {/each}
</div>
