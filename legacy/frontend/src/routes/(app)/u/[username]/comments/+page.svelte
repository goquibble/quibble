<script lang="ts">
  import { emoticons } from '$lib/constants/emoticons';
  import CommentType from '$lib/pages/u/comment-type.svelte';
  import type { PageServerData } from './$types';

  const { data }: { data: PageServerData } = $props();
</script>

{#if data.comments && data.comments.length}
  {#each data.comments as comment}
    <CommentType {...comment} />
  {/each}
{:else}
  <div class="flex flex-col">
    <span class="text-lg font-medium">{emoticons.ANNOYED}</span>
    <span class="text-sm">No comments here—check back later!</span>
  </div>
{/if}
