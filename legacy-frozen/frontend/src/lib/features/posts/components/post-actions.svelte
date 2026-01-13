<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import api, { type components } from '$lib/api';
  import { toasts_store } from '$lib/components/ui/toast';
  import { cn } from '$lib/functions/classnames';
  import { throttle } from '$lib/functions/throttle';
  import { auth_store } from '$lib/stores/auth.svelte';
  import readable from 'readable-numbers';

  // internal types
  type Post = components['schemas']['Post'];

  interface Props extends Post {
    class?: string;
  }

  let {
    id,
    ratio,
    upvotes,
    downvotes,
    comment_count,
    class: _class,
    slug,
    community,
    poster
  }: Props = $props();
  let reaction = $state<ReturnType<typeof get_reaction>>();
  let deleting = $state(false);

  $effect(() => {
    reaction = get_reaction();
  });

  function get_reaction(): 'upvoted' | 'downvoted' | null {
    if (auth_store.value.user) {
      if (upvotes?.includes(auth_store.value.user.profile.id)) return 'upvoted';
      else if (downvotes?.includes(auth_store.value.user.profile.id)) return 'downvoted';
      else return null;
    } else {
      return null;
    }
  }

  const throttled_handle_reaction = throttle(handle_reaction, 500);
  async function handle_reaction(action: 'upvote' | 'downvote') {
    try {
      if (reaction === `${action}d`) {
        // undo reaction
        reaction = null;
        ratio += action === 'upvote' ? -1 : 1;
      } else {
        if (reaction === 'upvoted') ratio -= 1;
        if (reaction === 'downvoted') ratio += 1;

        reaction = `${action}d`;
        if (reaction === 'upvoted') ratio += 1;
        if (reaction === 'downvoted') ratio -= 1;
      }

      const { response } = await api.PATCH('/posts/{id}/reaction/', {
        body: { action },
        params: { path: { id } }
      });

      if (!response.ok) throw new Error(`request failed with status: ${response.status}`);
    } catch (err) {
      console.error(err);
    }
  }

  function handle_share_click() {
    if (browser) {
      const link = new URL(window.location.href + `q/${community?.name}/posts/${id}/${slug}`);
      link.searchParams.set('ref', 'share');
      window.navigator.clipboard
        .writeText(link.toString())
        .then(() => toasts_store.success('Post link copied'));
    }
  }

  async function handle_delete() {
    try {
      deleting = true;
      const { response, error } = await api.DELETE('/posts/{id}/', {
        params: { path: { id } }
      });
      if (response.ok) {
        await goto('/', { invalidate: [(url) => url.pathname === '/'] });
        toasts_store.success('Post deleted!');
      } else if (error) {
        console.error(error);
      }
    } finally {
      deleting = false;
    }
  }
</script>

<div class={cn(_class, 'flex items-center gap-2')}>
  <div class="bg-neutral rounded-field relative flex items-center gap-1">
    <button
      class={cn(
        reaction === 'upvoted' ? 'btn-primary' : 'btn-neutral hover:text-primary',
        'btn btn-sm btn-square'
      )}
      aria-label="Upvote post"
      onclick={() => throttled_handle_reaction('upvote')}
    >
      <coreicons-shape-thumbs variant="up" class="size-4"></coreicons-shape-thumbs>
    </button>
    <span class="text-xs font-medium md:text-sm">{readable(ratio)}</span>
    <button
      class={cn(
        reaction === 'downvoted' ? 'btn-accent' : 'btn-neutral hover:text-accent',
        'btn btn-sm btn-square'
      )}
      aria-label="Downvote post"
      onclick={() => throttled_handle_reaction('downvote')}
    >
      <coreicons-shape-thumbs variant="down" class="size-4"></coreicons-shape-thumbs>
    </button>
  </div>
  <button class="btn btn-sm btn-neutral relative px-2">
    <coreicons-shape-forum class="size-4"></coreicons-shape-forum>
    <span class="text-xs font-medium md:text-sm">{readable(comment_count)}</span>
  </button>
  <button class="btn btn-sm btn-neutral relative hidden md:flex" onclick={handle_share_click}>
    <coreicons-shape-share class="size-4"></coreicons-shape-share>
    <span class="text-sm font-medium">Share</span>
  </button>
  <div class="dropdown-end dropdown relative">
    <div tabindex="0" role="button" class="btn btn-sm btn-square btn-ghost">
      <coreicons-shape-more class="size-4 rotate-90"></coreicons-shape-more>
    </div>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <ul tabindex="0" class="menu dropdown-content bg-base-100 z-10 mt-2 gap-1 rounded-2xl p-1.5">
      <li>
        <button class="flex items-center gap-2 rounded-xl p-2">
          <coreicons-shape-flag class="size-4"></coreicons-shape-flag>
          <span class="text-sm font-medium capitalize">Report</span>
        </button>
      </li>
      <li class="menu-disabled">
        <button class="flex items-center gap-2 rounded-xl p-2">
          <coreicons-shape-calendar class="size-4"></coreicons-shape-calendar>
          <span class="text-sm font-medium capitalize">Save</span>
        </button>
      </li>
      {#if poster?.id === auth_store.value.user?.profile.id}
        <li class="text-error" class:menu-disabled={deleting}>
          <button class="flex items-center gap-2 rounded-xl p-2" onclick={handle_delete}>
            {#if deleting}
              <span class="loading loading-spinner loading-xs"></span>
            {:else}
              <coreicons-shape-trash variant="without-lines" class="size-4"></coreicons-shape-trash>
            {/if}
            <span class="text-sm font-medium capitalize">Delete</span>
          </button>
        </li>
      {/if}
    </ul>
  </div>
</div>
