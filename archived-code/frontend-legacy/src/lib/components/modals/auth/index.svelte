<script lang="ts">
  import Quibbles from '$lib/components/icons/logos/quibbles.svelte';
  import BaseModal from '$lib/components/ui/base-modal.svelte';
  import { modals_store } from '$lib/stores/modals.svelte';

  function handle_modal_close() {
    modals_store.close('auth');
  }
</script>

<BaseModal
  open={modals_store.value.get('auth') === true}
  onclose={handle_modal_close}
  class="flex max-w-[25rem]! flex-col gap-5"
>
  <div class="flex flex-col items-center gap-4">
    <Quibbles class="h-20 w-auto" />
    <div class="flex flex-col items-center gap-2">
      <h3 class="text-info text-center text-xl font-bold">
        Join Quibble to engage with communities, share posts, and more!
      </h3>
      <span class="text-sm">Want to do more? Create an account or log in.</span>
    </div>
    <div class="flex w-full flex-col gap-2">
      <a href="/login" class="btn btn-primary btn-block" onclick={handle_modal_close}>
        Log in
        <coreicons-shape-log-in class="size-4"></coreicons-shape-log-in>
      </a>
      <a href="/register" class="btn btn-block" onclick={handle_modal_close}>Sign up</a>
    </div>
    <div class="divider my-0 text-xs font-bold before:h-px after:h-px">NOTE</div>
    <span class="text-center text-xs"
      >Project is in development, <br /> if you see any issues- please raise a ticket
      <a
        href="https://github.com/quibble-dev/Quibble/issues/new?template=bug_report.yml"
        target="_blank"
        class="text-info font-medium underline">here</a
      >.</span
    >
  </div>
  <button
    class="btn btn-circle btn-sm absolute top-2.5 right-2.5"
    aria-label="Close modal"
    onclick={handle_modal_close}
  >
    <coreicons-shape-x class="size-5" variant="no-border"></coreicons-shape-x>
  </button>
</BaseModal>
