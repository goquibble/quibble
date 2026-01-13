<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import api from '$lib/api';
  import ChartBarsIcon from '$lib/components/icons/chart-bars.svelte';
  import QuibbleTextLogo from '$lib/components/icons/logos/quibble-text.svelte';
  import QuibbleLogo from '$lib/components/icons/logos/quibble.svelte';
  import NotificationIcon from '$lib/components/icons/notification.svelte';
  import Avatar from '$lib/components/ui/avatar.svelte';
  import { auth_store } from '$lib/stores/auth.svelte';

  type Props = {
    on_menu_click?: () => void;
  };

  let { on_menu_click }: Props = $props();
  let pending = $state(false);

  const show_search_in_community = $derived(
    page.url.pathname.includes('/q/') && page.data.community
  );

  async function handle_log_out_click() {
    pending = true;
    const { response } = await api.POST('/auth/logout/');
    if (response.ok) await goto('/', { invalidateAll: true });
    pending = false;
  }
</script>

<header
  class="border-neutral bg-base-300 fixed top-0 z-20 flex h-[3.75rem] w-full items-center justify-between border-b px-4"
>
  <div class="flex items-center gap-4">
    <button
      onclick={on_menu_click}
      class="btn border-none bg-transparent! p-0 md:hidden"
      aria-label="open up sidebar"
    >
      <coreicons-shape-list class="size-5"></coreicons-shape-list>
    </button>
    <a href="/" aria-label="Quibble Home" class="flex items-center gap-2">
      <QuibbleLogo class="size-7" />
      <QuibbleTextLogo class="hidden h-7 w-auto md:flex" />
    </a>
  </div>
  <div class="hidden items-center gap-5 sm:flex">
    <div class="hidden gap-2 lg:flex">
      <a href="/" aria-label="Home" class="flex items-center gap-2">
        <coreicons-shape-home class="text-primary size-5"></coreicons-shape-home>
        <span class="text-sm font-medium">Home</span>
      </a>
      <a href="/q/popular" aria-label="Popular Communities" class="flex items-center gap-2">
        <ChartBarsIcon variant="popular" class="size-5" />
        <span class="text-sm font-medium">Popular</span>
      </a>
      <a href="/q/all" aria-label="All Communities" class="flex items-center gap-2">
        <ChartBarsIcon variant="all" class="size-5" />
        <span class="text-sm font-medium">All</span>
      </a>
    </div>
    <label class="input relative flex w-96 items-center bg-transparent">
      <coreicons-shape-search class="size-4 shrink-0"></coreicons-shape-search>
      {#if show_search_in_community}
        <div class="border-neutral bg-base-100 flex items-center gap-2 rounded-lg border p-1">
          <Avatar src={page.data.community.avatar} class="size-5 rounded-full" />
          <h5 class="text-xs font-medium whitespace-nowrap">
            q/{page.data.community.name}
          </h5>
        </div>
      {/if}
      <input
        placeholder={show_search_in_community ? `Search in q/${page.params.name}` : 'Search...'}
      />
    </label>
  </div>
  <div class="flex items-center gap-2">
    <button aria-label="Expand search" class="btn size-10 p-0 sm:hidden">
      <coreicons-shape-search variant="no-border" class="size-5"></coreicons-shape-search>
    </button>
    {#if auth_store.value.is_authenticated}
      <div class="tooltip tooltip-bottom" data-tip="Create a Post">
        <a
          href="/submit?type=TEXT"
          aria-label="Create a Post"
          class="btn md:btn-primary btn-square md:btn-wide md:px-3"
        >
          <coreicons-shape-plus variant="no-border" class="size-5"></coreicons-shape-plus>
          <span class="hidden text-sm font-medium md:flex">Create</span>
        </a>
      </div>
      <div class="tooltip tooltip-bottom" data-tip="Inbox">
        <button aria-label="Inbox" class="btn btn-neutral size-10 p-0">
          <NotificationIcon class="size-6" />
        </button>
      </div>
      <div class="tooltip tooltip-bottom flex before:left-0!" data-tip="Profile menu">
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button">
            <Avatar
              class="btn btn-neutral rounded-btn size-10 border-none p-0"
              src={auth_store.value.user?.profile.avatar}
            />
          </div>
          <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
          <ul
            tabindex="0"
            class="menu dropdown-content bg-base-100 rounded-box z-10 mt-2 min-w-40 gap-1 p-1.5"
          >
            <li>
              <a
                href="/u/{auth_store.value.user?.profile.username}"
                class="flex items-center gap-2"
              >
                <div class="grid w-6 place-items-center">
                  <Avatar src={auth_store.value.user?.profile.avatar} />
                </div>
                <div class="flex flex-col">
                  <span class="text-info font-medium">View Profile</span>
                  <span class="text-base-content/75 text-xs"
                    >u/{auth_store.value.user?.profile.username}<span> </span></span
                  >
                </div>
              </a>
            </li>
            <li>
              <a href="/settings" class="flex items-center gap-2">
                <div class="grid w-6 place-items-center">
                  <coreicons-shape-settings variant="outline" class="size-4"
                  ></coreicons-shape-settings>
                </div>
                <span class="font-medium">Settings</span>
              </a>
            </li>
            <div class="divider my-0 h-max before:h-px after:h-px"></div>
            <li class:menu-disabled={pending}>
              <button class="flex items-center gap-2" onclick={handle_log_out_click}>
                <div class="grid w-6 place-items-center">
                  {#if pending}
                    <span class="loading loading-spinner loading-xs"></span>
                  {:else}
                    <coreicons-shape-log-out class="size-4"></coreicons-shape-log-out>
                  {/if}
                </div>
                <span class="font-medium whitespace-nowrap">Log out</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    {:else}
      <a href="/register" class="btn">Sign up</a>
      <a href="/login" class="btn btn-primary">
        Log in
        <coreicons-shape-log-in class="size-4"></coreicons-shape-log-in>
      </a>
    {/if}
  </div>
</header>
