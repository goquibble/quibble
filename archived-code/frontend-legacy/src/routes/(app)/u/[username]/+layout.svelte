<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import LegalLinks from '$lib/components/legal-links.svelte';
  import Avatar from '$lib/components/ui/avatar.svelte';
  import { toasts_store } from '$lib/components/ui/toast';
  import { FormatDate } from '$lib/functions/date';
  import { auth_store } from '$lib/stores/auth.svelte';
  import type { LayoutData } from './$types';
  import type { Snippet } from 'svelte';

  const types = {
    '': {
      label: 'Overview',
      disabled: false,
      class: 'flex'
    },
    posts: {
      label: 'Posts',
      disabled: false,
      class: 'flex'
    },
    comments: {
      label: 'Comments',
      disabled: false,
      class: 'flex'
    },
    saved: {
      label: 'Saved',
      disabled: true,
      class: 'hidden sm:flex'
    },
    upvoted: {
      label: 'Upvoted',
      disabled: true,
      class: 'hidden sm:flex md:hidden xl:flex'
    },
    downvoted: {
      label: 'Downvoted',
      disabled: true,
      class: 'hidden sm:flex md:hidden xl:flex'
    }
  };

  const { data, children }: { data: LayoutData; children: Snippet } = $props(),
    { profile } = $derived(data),
    base_path = $derived(`/u/${profile?.username}`),
    is_own_profile = $derived(
      profile && auth_store.value.user && profile.id === auth_store.value.user.profile.id
    );

  function check_is_active(key: string) {
    if (key === '') return page.url.pathname === base_path;
    return page.url.pathname === `${base_path}/${key}`;
  }

  function handle_share_click() {
    if (browser) {
      const link = new URL(page.url.href);
      link.searchParams.set('ref', 'share');
      window.navigator.clipboard
        .writeText(link.toString())
        .then(() => toasts_store.success('Link copied'));
    }
  }
</script>

<svelte:head>
  <title>{`${profile?.name ?? profile?.username} (u/${profile?.username})`.trim()} - Quibble</title>
</svelte:head>

<div class="flex h-max flex-1 flex-col gap-4 p-4">
  <div class="flex items-center gap-4">
    <div class="relative">
      <Avatar src={profile?.avatar} class="size-20" />
      {#if is_own_profile}
        <a
          href="/settings/profile?open=avatar"
          class="btn btn-sm btn-circle absolute right-0 bottom-0"
          aria-label="Update profile picture"
        >
          <coreicons-shape-upload variant="cloud" class="size-4"></coreicons-shape-upload>
        </a>
      {/if}
    </div>
    <div class="flex flex-col">
      <h2 class="text-info text-xl font-medium">{profile?.name ?? profile?.username}</h2>
      <span class="text-sm">u/{profile?.username}</span>
    </div>
  </div>
  <div role="tablist" class="tabs tabs-box w-max">
    {#each Object.entries(types) as [key, item]}
      {@const active = check_is_active(key)}
      <a
        href={`${base_path}/${key}`}
        role="tab"
        class="tab font-medium"
        class:tab-active={active}
        class:tab-disabled={item.disabled}>{item.label}</a
      >
    {/each}
  </div>
  <div class="flex flex-col gap-4">
    {@render children()}
  </div>
</div>
<div class="hidden w-80 lg:flex">
  <div
    class="scrollbar-none fixed top-[3.75rem] flex h-[calc(100dvh-3.75rem)] w-80 flex-col gap-2 overflow-y-scroll p-4"
  >
    {#if is_own_profile || profile?.banner}
      <div
        class="bg-neutral rounded-box relative h-20 bg-cover bg-center bg-no-repeat"
        style="background-image: url({profile?.banner});"
      >
        {#if is_own_profile}
          <a
            href="/settings/profile?open=banner"
            class="btn btn-sm btn-circle absolute right-1 bottom-1"
            aria-label="Update profile picture"
          >
            <coreicons-shape-upload variant="cloud" class="size-4"></coreicons-shape-upload>
          </a>
        {/if}
      </div>
    {/if}
    <div class="flex items-center justify-between">
      <h3 class="font-medium">{profile?.name ?? `u/${profile?.username}`}</h3>
      <button class="btn btn-xs btn-neutral w-max" onclick={handle_share_click}>
        <coreicons-shape-share class="size-4"></coreicons-shape-share>
        Share
      </button>
    </div>
    {#if profile?.bio}
      <p class="text-base-content/75 text-sm">{profile.bio}</p>
    {/if}
    <div class="flex items-center gap-2 text-xs">
      <coreicons-shape-gift class="size-4"></coreicons-shape-gift>
      Cake day, {new FormatDate(profile?.created_at ?? '').format()}
    </div>
    {#if is_own_profile}
      <div class="divider my-0 before:h-px after:h-px"></div>
      <h4 class="text-sm font-medium">SETTINGS</h4>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="grid w-6 place-items-center">
            <Avatar src={auth_store.value.user?.profile.avatar} />
          </div>
          <div class="flex flex-col">
            <span class="text-sm">Profile</span>
            <span class="text-base-content/75 text-xs">Customize your profile</span>
          </div>
        </div>
        <a href="/settings/profile" class="btn btn-sm btn-neutral">Update</a>
      </div>
    {/if}
    <div class="divider my-0 before:h-px after:h-px"></div>
    <LegalLinks />
  </div>
</div>
