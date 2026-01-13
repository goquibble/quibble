<script lang="ts">
  import Toaster from '$lib/components/ui/toast';
  import { cn } from '$lib/functions/classnames';
  import type { Nullable } from '$lib/types/shared';
  import type { Snippet } from 'svelte';

  type Props = {
    children: Snippet<[]>;
    open: boolean;
    onclose: () => void;
    class?: string;
  };

  let { children, open, onclose, class: klass }: Props = $props();

  let dialog_el = $state<Nullable<HTMLDialogElement>>(null);

  $effect(() => {
    if (open) {
      dialog_el?.showModal();
    } else {
      dialog_el?.close();
    }
  });
</script>

<dialog
  class="modal modal-bottom sm:modal-middle scrollbar-none px-4"
  bind:this={dialog_el}
  {onclose}
>
  <div class={cn(klass, 'modal-box bg-base-300 scrollbar-none border-neutral mx-auto border')}>
    {@render children()}
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
  <!-- render toasts -->
  <!-- https://stackoverflow.com/questions/77099074/layering-toast-alerts-above-dialog-modal -->
  <!-- https://github.com/saadeghi/daisyui/issues/2858#issuecomment-2010246981 -->
  <Toaster inside_modal={true} />
</dialog>
