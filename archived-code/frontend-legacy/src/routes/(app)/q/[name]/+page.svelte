<script lang="ts">
  import { goto } from '$app/navigation';
  import api from '$lib/api';
  import Avatar from '$lib/components/ui/avatar.svelte';
  import { toasts_store } from '$lib/components/ui/toast';
  import { PostCard, PostsHeader } from '$lib/features/posts';
  import { cn } from '$lib/functions/classnames';
  import { FormatDate } from '$lib/functions/date';
  import { pluralize } from '$lib/functions/pluralize';
  import { auth_store } from '$lib/stores/auth.svelte';
  import { sidebar_store } from '$lib/stores/sidebar.svelte';
  import type { PageData } from './$types';
  import { onMount } from 'svelte';

  const { data }: { data: PageData } = $props();
  const { community, posts, highlighted_posts } = $derived(data);
  let deleting = $state(false);

  const is_joined = $derived.by(() => {
    if (auth_store.value.user && community) {
      return community.members?.includes(auth_store.value.user.profile.id);
    }
  });

  function add_to_sidebar_store(key: string) {
    sidebar_store.add_community(key, {
      id: community.id,
      avatar: community.avatar,
      name: community.name
    });
  }

  async function handle_delete() {
    try {
      deleting = true;
      const { response, error } = await api.DELETE('/q/communities/{name}/', {
        params: { path: { name: community.name } }
      });
      if (response.ok) {
        await goto('/', { invalidate: [(url) => url.pathname === '/'] });
        toasts_store.success('Community deleted!');
      } else if (error) {
        console.error(error);
      }
    } finally {
      deleting = false;
    }
  }

  onMount(() => {
    add_to_sidebar_store('recent');
    if (is_joined) add_to_sidebar_store('your');
  });
</script>

<svelte:head>
  <title>q/{community?.name}</title>
</svelte:head>

<div class="relative">
  <!-- show community cover if not null or solid bg -->
  <div
    class={cn(
      !community?.banner ? 'bg-neutral h-24' : 'h-24 bg-cover bg-center md:h-28',
      'w-full rounded-2xl'
    )}
    style="background-image: url({community?.banner});"
  ></div>
  <div
    class="inset-x-0 -bottom-12 flex flex-col justify-between gap-4 xl:absolute xl:flex-row xl:items-end xl:px-4"
  >
    <div class="mt-4 flex items-center gap-2 xl:mt-0 xl:items-end">
      <Avatar
        class="ring-base-300 size-14 shrink-0 rounded-full xl:size-20 xl:ring-8"
        src={community?.avatar}
      />
      <div class="flex flex-col">
        <h3 class="text-info text-xl font-bold xl:text-2xl">q/{community?.name}</h3>
        <div class="flex items-center gap-2 xl:hidden">
          <div class="flex items-center gap-1">
            <span class="text-info text-sm">{community?.members?.length}</span>
            <span class="text-base-content/75 text-xs"
              >{pluralize('Member', community?.members?.length ?? 0)}</span
            >
          </div>
          <div class="flex items-center gap-1">
            <span class="text-info text-sm">{community?.posts_count}</span>
            <span class="text-base-content/75 text-xs"
              >{pluralize('Post', community?.posts_count)}</span
            >
          </div>
        </div>
      </div>
    </div>
    <!-- community basic operations -->
    <div class="flex items-center gap-2">
      <button class="btn btn-primary" aria-label="Create a Post" disabled>
        <coreicons-shape-plus variant="no-border" class="size-5"></coreicons-shape-plus>
        <span class="text-sm font-medium">Create Post</span>
      </button>
      <button hidden class="btn btn-secondary" aria-label="Join Community">
        <span class="text-sm font-medium">{is_joined ? 'Joined' : 'Join'}</span>
      </button>
      <div class="dropdown-end dropdown relative">
        <div tabindex="0" role="button" class="btn btn-square btn-neutral">
          <coreicons-shape-more class="size-5 rotate-90"></coreicons-shape-more>
        </div>
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <ul
          tabindex="0"
          class="menu dropdown-content bg-base-100 z-10 mt-2 w-max gap-1 rounded-2xl p-1.5"
        >
          <li>
            <button class="flex items-center gap-2 rounded-xl p-2">
              <coreicons-shape-flag class="size-4"></coreicons-shape-flag>
              <span class="text-sm font-medium capitalize">Report</span>
            </button>
          </li>
          <li class="menu-disabled">
            <button class="flex items-center gap-2 rounded-xl p-2">
              <coreicons-shape-heart class="size-4"></coreicons-shape-heart>
              <span class="text-sm font-medium capitalize">Favorite</span>
            </button>
          </li>
          {#if community.moderators.some((m) => m.id === auth_store.value.user?.profile.id)}
            <li class="text-error" class:menu-disabled={deleting}>
              <button class="flex items-center gap-2 rounded-xl p-2" onclick={handle_delete}>
                {#if deleting}
                  <span class="loading loading-spinner loading-xs"></span>
                {:else}
                  <coreicons-shape-trash variant="without-lines" class="size-4"
                  ></coreicons-shape-trash>
                {/if}
                <span class="text-sm font-medium capitalize">Delete</span>
              </button>
            </li>
          {/if}
        </ul>
      </div>
    </div>
  </div>
</div>
<div class="hidden h-12 xl:flex"></div>
<PostsHeader />
<!-- list highlighted posts if exists -->
{#if highlighted_posts?.length}
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <coreicons-shape-hash class="size-5"></coreicons-shape-hash>
      <h4 class="font-medium">Highlights</h4>
    </div>
    <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
      {#each highlighted_posts as post (post.id)}
        <div
          class="border-neutral hover:bg-base-200 relative flex h-40 flex-col gap-2 overflow-hidden rounded-2xl border p-2 transition-colors"
        >
          <div
            class="outline-base-content/15 flex-1 rounded-xl bg-cover bg-center outline -outline-offset-1"
            class:bg-base-100={!post.cover}
            style="background-image: url({post.cover});"
          ></div>
          <div class="flex flex-col p-2 pt-0.5">
            <h4 class="line-clamp-1 font-medium">{post.title}</h4>
            <span class="text-base-content/75 text-xs font-medium"
              >{new FormatDate(post.created_at).format()}</span
            >
          </div>
          <a
            href="./{community?.name}/posts/{post.id}/{post.slug}"
            class="absolute inset-0"
            aria-label={post.title}
          ></a>
        </div>
      {/each}
    </div>
  </div>
{/if}
<!-- list posts -->
{#if posts}
  {#each posts as post (post.id)}
    <PostCard {...post} />
  {/each}
{/if}
