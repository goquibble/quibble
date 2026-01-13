<script lang="ts">
  import Error from '$lib/components/error.svelte';
  import Avatar from '$lib/components/ui/avatar.svelte';
  import { emoticons } from '$lib/constants/emoticons';
  import { PostCard, PostsHeader } from '$lib/features/posts';
  import { recent_posts_store } from '$lib/features/posts/stores/recent-posts.svelte';
  import type { PageData } from './$types';
  import readable from 'readable-numbers';

  const { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>Quibble - Delve into real conversations.</title>
</svelte:head>

<div class="flex h-max flex-1 flex-col gap-4 p-4">
  <PostsHeader />
  <div class="flex flex-1 flex-col gap-4">
    {#if data.posts && data.posts.length}
      {#each data.posts as post (post.id)}
        <PostCard {...post} />
      {/each}
    {:else}
      <Error
        message="The silence is deafening—why not break it?"
        fallback_options={{
          text: 'Create a Post',
          href: '/submit?type=TEXT',
          icon: '<coreicons-shape-plus variant="no-border" class="size-4"></coreicons-shape-plus>'
        }}
      />
    {/if}
  </div>
</div>
<div class="hidden w-80 lg:flex">
  <div
    class="scrollbar-none fixed top-[3.75rem] flex h-[calc(100dvh-3.75rem)] w-72 flex-col gap-4 overflow-y-scroll p-4"
  >
    <div class="flex items-center justify-between">
      <h2 class="font-medium">Recent Posts</h2>
      <button
        class="btn btn-ghost btn-xs z-10"
        disabled={recent_posts_store.value.length === 0}
        onclick={recent_posts_store.clear}>Clear</button
      >
    </div>
    <div class="flex flex-col gap-4">
      {#if recent_posts_store.value.length}
        {#each recent_posts_store.value as post (post.id)}
          <div class="flex flex-col gap-2">
            <div class="flex justify-between gap-2">
              <div class="flex flex-col gap-1">
                <a
                  href="/q/{post.community.name}"
                  class="hover:text-accent flex items-center gap-2 hover:underline"
                >
                  <Avatar src={post.community.avatar} class="size-6 rounded-full" />
                  <h3 class="text-xs font-semibold">q/{post.community.name}</h3>
                </a>
                <a
                  href="/q/{post.community.name}/posts/{post.id}/{post.slug}"
                  class="text-info font-semibold hover:underline"
                >
                  {post.title}
                </a>
              </div>
              {#if post.cover}
                <img
                  class="aspect-square size-20 shrink-0 rounded-xl object-cover"
                  src={post.cover}
                  alt=""
                />
              {/if}
            </div>
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
        {/each}
      {:else}
        <div class="flex flex-col">
          <span class="text-lg font-medium">{emoticons.ANGRY}</span>
          <span class="text-sm">Nothing here yet—go find a Post!</span>
        </div>
      {/if}
    </div>
  </div>
</div>
