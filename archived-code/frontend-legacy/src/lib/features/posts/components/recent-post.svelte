<script lang="ts">
  import Avatar from '$lib/components/ui/avatar.svelte';
  import type { RecentPost } from '../types/recent-post.type';
  import readable from 'readable-numbers';

  let post: RecentPost = $props();
</script>

<div class="flex flex-col gap-2">
  <!-- top section: post community details and post contents -->
  <div class="flex justify-between gap-2">
    <div class="flex flex-col gap-1">
      <!-- community details -->
      <a
        href="/q/{post.community.name}"
        class="hover:text-accent flex items-center gap-2 hover:underline"
      >
        <Avatar src={post.community.avatar} class="size-6 rounded-full" />
        <h3 class="text-xs font-semibold">q/{post.community.name}</h3>
      </a>
      <!-- post title -->
      <a
        href="/q/{post.community.name}/posts/{post.slug}"
        class="text-info font-semibold hover:underline"
      >
        {post.title}
      </a>
    </div>
    <!-- render post cover if contains -->
    {#if post.cover}
      <img class="aspect-square size-20 shrink-0 rounded-xl object-cover" src={post.cover} alt="" />
    {/if}
  </div>

  <!-- bottom section: post votes and comments -->
  <div class="flex items-center gap-2">
    <p class="text-xs font-medium">
      {readable(post.upvotes?.length ?? 0)} upvotes
    </p>
    <coreicons-shape-circle variant="filled" class="size-0.5"></coreicons-shape-circle>
    <p class="text-xs font-medium">
      {readable(post.comments?.length ?? 0)} comments
    </p>
  </div>
</div>
