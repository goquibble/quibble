<script lang="ts">
  import QuibbleIcon from '$lib/components/icons/logos/quibble.svelte';
  import Avatar from '$lib/components/ui/avatar.svelte';
  import { emoticons } from '$lib/constants/emoticons';
  import { auth_store } from '$lib/stores/auth.svelte';
  import { modals_store } from '$lib/stores/modals.svelte';
  import { sidebar_store } from '$lib/stores/sidebar.svelte';

  function handle_create_a_communiy_btn_click(e: MouseEvent) {
    if (!auth_store.value.is_authenticated) {
      e.preventDefault();
      modals_store.open('auth');
    }
  }
</script>

<div
  class="border-neutral bg-base-300 scrollbar-none fixed flex h-[calc(100dvh-3.75rem)] w-72 flex-col gap-4 overflow-y-scroll border-r p-4 md:top-[3.75rem] md:z-10"
>
  <div class="flex flex-col gap-2">
    <label class="input input-sm bg-transparent">
      <input placeholder="Search filter..." />
      <coreicons-shape-filter class="size-3"></coreicons-shape-filter>
    </label>
    <a
      href="/q/create"
      class="btn btn-xs btn-neutral w-max"
      onclick={handle_create_a_communiy_btn_click}
    >
      <coreicons-shape-plus variant="circle" class="size-4"></coreicons-shape-plus>
      <span class="text-xs font-medium">Create a community</span>
    </a>
  </div>
  <div class="collapse gap-2 rounded-none">
    <input type="checkbox" checked={true} class="peer min-h-max! p-0!" />
    <div
      class="collapse-title text-base-content/75 flex min-h-max items-center justify-between p-0 text-sm font-medium peer-checked:[&>div>coreicons-shape-chevron]:rotate-180"
    >
      Recent
      <div class="flex items-center gap-2">
        <button
          class="btn btn-ghost btn-xs z-10"
          disabled={(sidebar_store.value.recent ?? []).length === 0}
          onclick={() => sidebar_store.clear('recent')}>Clear</button
        >
        <coreicons-shape-chevron class="size-4 transition-transform" variant="down"
        ></coreicons-shape-chevron>
      </div>
    </div>
    {#if sidebar_store.value.recent && sidebar_store.value.recent.length}
      <div class="collapse-content flex flex-col gap-2 p-0!">
        {#each sidebar_store.value.recent as community (community.id)}
          <div class="flex items-center gap-2">
            <a href="/q/{community.name}" class="flex">
              <Avatar src={community.avatar} />
            </a>
            <a href="/q/{community.name}" class="text-sm font-medium">q/{community.name}</a>
            <button
              onclick={() => sidebar_store.toggle_star('recent', community.name)}
              class="ml-auto cursor-pointer"
              aria-label="Star Community"
            >
              <coreicons-shape-star class="size-4" class:text-primary={community.starred}
              ></coreicons-shape-star>
            </button>
          </div>
        {/each}
      </div>
    {:else}
      <span class="text-sm">{emoticons.SUSPICIOUS} Just in—take a peek.</span>
    {/if}
  </div>
  <div class="collapse gap-2 overflow-visible rounded-none">
    <input type="checkbox" checked={true} class="peer min-h-max! p-0!" />
    <div
      class="collapse-title text-base-content/75 flex min-h-max items-center justify-between p-0 text-sm font-medium peer-checked:[&>div>coreicons-shape-chevron]:rotate-180"
    >
      Your Communities
      <div class="flex items-center gap-2">
        <button
          class="btn btn-ghost btn-xs z-10"
          disabled={(sidebar_store.value.your ?? []).length === 0}
          onclick={() => sidebar_store.clear('your')}>Clear</button
        >
        <coreicons-shape-chevron class="size-4 transition-transform" variant="down"
        ></coreicons-shape-chevron>
      </div>
    </div>
    {#if sidebar_store.value.your && sidebar_store.value.your.length}
      <div class="collapse-content flex flex-col gap-2 p-0!">
        {#each sidebar_store.value.your as community (community.id)}
          <div class="flex items-center gap-2">
            <a href="/q/{community.name}" class="flex">
              <Avatar src={community.avatar} />
            </a>
            <a href="/q/{community.name}" class="text-sm font-medium">q/{community.name}</a>
            <button
              onclick={() => sidebar_store.toggle_star('your', community.name)}
              class="ml-auto"
              aria-label="Star Community"
            >
              <coreicons-shape-star class="size-4" class:text-primary={community.starred}
              ></coreicons-shape-star>
            </button>
          </div>
        {/each}
      </div>
    {:else}
      <span class="text-sm">{emoticons.SHY} Ready to quibble? Join in.</span>
    {/if}
  </div>
  <div class="collapse gap-2 overflow-visible rounded-none">
    <input type="checkbox" checked={true} class="peer min-h-max! p-0!" />
    <div
      class="collapse-title text-base-content/75 flex min-h-max items-center justify-between p-0 text-sm font-medium peer-checked:[&>coreicons-shape-chevron]:rotate-180"
    >
      Resources
      <coreicons-shape-chevron class="size-4 transition-transform" variant="down"
      ></coreicons-shape-chevron>
    </div>
    <div class="collapse-content flex flex-col gap-2 p-0!">
      <a href="https://github.com/quibble-dev/Quibble" class="flex items-center gap-2">
        <QuibbleIcon class="size-4" />
        <span class="text-sm font-medium">About Quibble</span>
      </a>
      <a href="https://github.com/quibble-dev/Quibble/discussions" class="flex items-center gap-2">
        <coreicons-shape-help-circle class="size-4"></coreicons-shape-help-circle>
        <span class="text-sm font-medium">Help</span>
      </a>
    </div>
  </div>
  <p class="text-xs">Quibble © {new Date().getFullYear()}. All rights reserved.</p>
</div>
