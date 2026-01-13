<script lang="ts">
  import type { components } from '$lib/api';
  import { emoticons } from '$lib/constants/emoticons';
  import PostCard from '$lib/features/posts/components/post-card.svelte';
  import CommentType from '$lib/pages/u/comment-type.svelte';
  import type { CommentOverview as Comment } from '$lib/types/comment';
  import type { PageServerData } from './$types';

  // internal types
  type Overview = components['schemas']['Overview'];
  type Post = components['schemas']['Post'];

  // generic types
  interface TypedOverview<T extends Record<string, unknown>> extends Overview {
    content: T;
  }

  // type guards
  function is_comment_type(item: Overview): item is TypedOverview<Comment> {
    return item.content_type === 'comment';
  }

  function is_post_type(item: Overview): item is TypedOverview<Post> {
    return item.content_type === 'post';
  }

  const { data }: { data: PageServerData } = $props();
</script>

{#if data.overview && data.overview.length}
  {#each data.overview as item}
    {#if is_comment_type(item)}
      <CommentType {...item.content} />
    {:else if is_post_type(item)}
      <PostCard always_on_card={true} {...item.content} />
    {/if}
  {/each}
{:else}
  <div class="flex flex-col">
    <span class="text-lg font-medium">{emoticons.SAD}</span>
    <span class="text-sm">Nothing to see here—check back later!</span>
  </div>
{/if}
