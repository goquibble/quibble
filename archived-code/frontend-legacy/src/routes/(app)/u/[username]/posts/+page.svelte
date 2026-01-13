<script lang="ts">
  import { emoticons } from '$lib/constants/emoticons';
  import PostCard from '$lib/features/posts/components/post-card.svelte';
  import type { PageServerData } from './$types';

  const { data }: { data: PageServerData } = $props();
</script>

{#if data.posts && data.posts.length}
  {#each data.posts ?? [] as post}
    <PostCard always_on_card={true} {...post} />
  {/each}
{:else}
  <div class="flex flex-col">
    <span class="text-lg font-medium">{emoticons.ANGRY}</span>
    <span class="text-sm">No posts here—check back later!</span>
  </div>
{/if}
