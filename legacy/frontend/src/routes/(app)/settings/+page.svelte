<script lang="ts">
  import { goto } from '$app/navigation';
  import api from '$lib/api';
  import BaseModal from '$lib/components/ui/base-modal.svelte';
  import { toasts_store } from '$lib/components/ui/toast';
  import { cn } from '$lib/functions/classnames';
  import type { ISettingItem } from '$lib/pages/settings/setting-item.svelte';
  import SettingItem from '$lib/pages/settings/setting-item.svelte';
  import { auth_store } from '$lib/stores/auth.svelte';
  import type { Nullable } from '$lib/types/shared';

  const general_settings: ISettingItem[] = $derived([
    {
      title: 'Email address',
      sub_title: 'Changing your email address will affect all your profiles',
      value: auth_store.value.user?.email ?? 'Not set',
      aria_label: 'Change email address',
      disabled: true
    },
    {
      title: 'Gender',
      value: 'Not set',
      aria_label: 'Change gender',
      disabled: true
    },
    {
      title: 'Location customization',
      value: 'Use approximate (based on IP)',
      aria_label: 'Change location',
      disabled: true
    }
  ]);

  const advanced_settings: ISettingItem[] = [
    {
      title: 'Delete account',
      sub_title: 'Not revertable!',
      aria_label: 'Delete account',
      is_dangerous: true
    }
  ];

  let pending = $state(false);
  let show_delete_modal = $state(false);

  async function handle_delete() {
    // eslint-disable-next-line no-undef
    let pending_timeout: Nullable<NodeJS.Timeout> = null;
    try {
      pending_timeout = setTimeout(() => (pending = true), 500);
      const { response } = await api.DELETE('/u/me/');
      if (response.ok) {
        await goto('/', { invalidateAll: true });
        toasts_store.success('Account deleted!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      pending = false;
      if (pending_timeout) clearTimeout(pending_timeout);
    }
  }
</script>

<svelte:head>
  <title>Settings - Account</title>
</svelte:head>

<div class="flex flex-col gap-2">
  <h3 class="text-lg font-medium">General</h3>
  <div class="divider"></div>
  {#each general_settings as setting}
    <SettingItem {...setting} />
  {/each}
  <div></div>
  <h3 class="text-lg font-medium">Advanced</h3>
  <div class="divider"></div>
  {#each advanced_settings as setting}
    <SettingItem
      {...setting}
      onclick={() => {
        if (setting.is_dangerous) show_delete_modal = true;
      }}
    />
  {/each}
</div>

<BaseModal
  open={show_delete_modal}
  onclose={() => (show_delete_modal = false)}
  class="flex max-w-[25rem]! flex-col gap-4"
>
  <div class="flex flex-col">
    <h3 class="text-info font-medium">Delete account</h3>
    <span class="text-base-content/75 text-sm">
      Deleting your account will also delete all profiles associated with it.
    </span>
  </div>
  <div class="flex items-center justify-end gap-2">
    <button type="button" onclick={() => (show_delete_modal = false)} class="btn">Cancel</button>
    <button
      class={cn(pending && 'btn-active pointer-events-none', 'btn btn-error')}
      onclick={handle_delete}
    >
      Delete
      {#if pending}
        <span class="loading loading-spinner loading-xs"></span>
      {:else}
        <coreicons-shape-trash variant="without-lines" class="size-4"></coreicons-shape-trash>
      {/if}
    </button>
  </div>
</BaseModal>
