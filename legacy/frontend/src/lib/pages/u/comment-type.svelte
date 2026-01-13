<script lang="ts">
  import Avatar from '$lib/components/ui/avatar.svelte';
  import CommentActions from '$lib/features/comments/components/comment-actions.svelte';
  import { FormatDate } from '$lib/functions/date';
  import type { CommentOverview as Props } from '$lib/types/comment';

  const {
    post,
    commenter,
    is_op,
    reply_to,
    created_at,
    content,
    id,
    ratio,
    upvotes,
    downvotes
  }: Props = $props();
</script>

<div
  class="rounded-box hover:bg-base-200 border-neutral relative relative flex gap-2 overflow-hidden border p-4 transition-colors transition-colors duration-75"
>
  <a
    href="/q/{post.community.name}/posts/{post.id}/{post.slug}"
    class="absolute inset-0"
    aria-label={post.title}
  ></a>
  <a href="/q/{post.community.name}" class="relative">
    <Avatar src={post.community.avatar} />
  </a>
  <div class="flex flex-col gap-1">
    <div class="flex items-center gap-2 text-xs">
      <a href="/q/{post.community.name}" class="link link-hover relative font-semibold"
        >q/{post.community.name}</a
      >
      <coreicons-shape-circle variant="filled" class="size-0.5"></coreicons-shape-circle>
      <a
        href="/q/{post.community.name}/posts/{post.id}/{post.slug}"
        class="link link-hover relative">{post.title}</a
      >
    </div>
    <div class="flex items-center gap-1 text-xs">
      <a href="/u/{commenter}" class="link link-hover relative font-semibold">{commenter}</a>
      {#if is_op}<span class="text-accent font-bold">OP</span>{/if}
      {#if reply_to}
        <span class="text-base-content/75">replied to</span>
        <a href="/u/{reply_to}" class="link link-hover relative text-xs font-semibold">{reply_to}</a
        >
      {:else}
        <span class="text-base-content/75">commented</span>
      {/if}
      <span class="text-base-content/75">{new FormatDate(created_at).timeAgo()}</span>
    </div>
    <p class="text-info mt-1 text-sm whitespace-pre-wrap">{content}</p>
    <CommentActions class="relative mt-1" {id} {ratio} {upvotes} {downvotes} />
  </div>
</div>
