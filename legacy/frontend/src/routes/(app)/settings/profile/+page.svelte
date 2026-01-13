<script lang="ts">
  import { goto, invalidate } from '$app/navigation';
  import api from '$lib/api';
  import BaseModal from '$lib/components/ui/base-modal.svelte';
  import { toasts_store } from '$lib/components/ui/toast';
  import { cn } from '$lib/functions/classnames';
  import AvatarSetting from '$lib/pages/settings/profile/avatar-setting.svelte';
  import BannerSetting from '$lib/pages/settings/profile/banner-setting.svelte';
  import BioSetting from '$lib/pages/settings/profile/bio-setting.svelte';
  import NameSetting from '$lib/pages/settings/profile/name-setting.svelte';
  import SettingItem, { type ISettingItem } from '$lib/pages/settings/setting-item.svelte';
  import type { ProfileSettingsProps } from '$lib/schemas/settings';
  import type { Nullable } from '$lib/types/shared';
  import type { Component } from 'svelte';
  import { superForm } from 'sveltekit-superforms';

  type Settings = 'name' | 'bio' | 'avatar' | 'banner' | 'title';

  const { data } = $props();

  const settings_component_mapping: Partial<
    Record<Settings, Component<ProfileSettingsProps, object, ''>>
  > = {
    name: NameSetting,
    bio: BioSetting,
    avatar: AvatarSetting,
    banner: BannerSetting
  };

  const general_settings: Record<Settings, ISettingItem> = $derived({
    name: {
      title: 'Display name',
      sub_title: 'Changing your display name won’t change your username',
      value: data.profile?.name ?? 'Not set',
      aria_label: 'Change name'
    },
    bio: {
      title: 'Description/bio',
      aria_label: 'Change description/bio'
    },
    avatar: {
      title: 'Avatar',
      sub_title: 'Edit your avatar or upload an image',
      aria_label: 'Change avatar'
    },
    banner: {
      title: 'Banner',
      sub_title: 'Upload an image',
      aria_label: 'Change banner'
    },
    title: {
      title: 'Social links',
      aria_label: 'Change social links',
      disabled: true
    }
  });

  const advanced_settings: ISettingItem[] = $derived([
    {
      title: `Delete u/${data.profile?.username}`,
      sub_title: `Deleting your profile won't affect your account.`,
      aria_label: 'Delete profile',
      is_dangerous: true
    }
  ]);

  let pending = $state(false);
  let show_delete_modal = $state(false);
  let show_modal = $state(false);
  let show_setting = $state<Nullable<Settings>>(null);
  const SettingComponent = $derived(
    show_setting !== null ? settings_component_mapping[show_setting] : null
  );

  const { form, errors, enhance, delayed } = superForm(data.form!, {
    resetForm: false,
    onSubmit({ formData }) {
      if ($form.avatar) formData.set('avatar', $form.avatar);
      if ($form.banner) formData.set('banner', $form.banner);
    },
    async onResult({ result }) {
      if (result.type === 'success') {
        await invalidate((url) => url.pathname === '/settings/profile');
        show_modal = false;
      }
    }
  });

  async function handle_delete() {
    if (!data.profile?.id) return;
    // eslint-disable-next-line no-undef
    let pending_timeout: Nullable<NodeJS.Timeout> = null;
    try {
      pending_timeout = setTimeout(() => (pending = true), 500);
      const { response } = await api.DELETE('/u/me/profiles/{id}/', {
        params: { path: { id: data.profile.id } }
      });
      if (response.ok) {
        await goto('/', { invalidateAll: true });
        toasts_store.success('Profile deleted!');
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
  <title>Settings - Profile</title>
</svelte:head>

<div class="flex flex-col gap-2">
  <h3 class="text-lg font-medium">General</h3>
  <div class="divider"></div>
  {#each Object.entries(general_settings) as [key, setting]}
    <SettingItem
      {...setting}
      onclick={() => {
        show_modal = true;
        show_setting = key as Settings;
      }}
    />
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

<BaseModal open={show_modal} onclose={() => (show_modal = false)} class="max-w-[25rem]!">
  <form method="POST" enctype="multipart/form-data" class="flex flex-1 flex-col gap-4" use:enhance>
    {#if SettingComponent}
      <SettingComponent {form} {errors} />
    {/if}
    <div class="flex items-center justify-end gap-2">
      <button type="button" onclick={() => (show_modal = false)} class="btn">Cancel</button>
      <button class={cn($delayed && 'btn-active pointer-events-none', 'btn btn-primary')}>
        Save
        {#if $delayed}
          <span class="loading loading-spinner loading-xs"></span>
        {:else}
          <coreicons-shape-check class="size-4"></coreicons-shape-check>
        {/if}
      </button>
    </div>
  </form>
</BaseModal>

<BaseModal
  open={show_delete_modal}
  onclose={() => (show_delete_modal = false)}
  class="flex max-w-[25rem]! flex-col gap-4"
>
  <div class="flex flex-col">
    <h3 class="text-info font-medium">Delete u/{data.profile?.username}</h3>
    <span class="text-base-content/75 text-sm"
      >Deleting your profile won't affect your account.</span
    >
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
