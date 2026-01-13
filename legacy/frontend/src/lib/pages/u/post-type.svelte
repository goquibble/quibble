<script lang="ts">
  import type { components } from '$lib/api';
  import Avatar from '$lib/components/ui/avatar.svelte';
  import PostActions from '$lib/features/posts/components/post-actions.svelte';
  import { FormatDate } from '$lib/functions/date';

  type Props = components['schemas']['Post'];

  const {
    id,
    slug,
    title,
    community,
    created_at,
    content,
    ratio,
    upvotes,
    downvotes,
    comments
  }: Props = $props();
</script>

<div
  class="rounded-box hover:bg-base-200 relative relative flex flex-col gap-1 overflow-hidden p-4 transition-colors transition-colors duration-75"
>
  <a href="/q/{community.name}/posts/{id}/{slug}" class="absolute inset-0" aria-label={title}></a>
  <div class="flex items-center gap-2 text-xs">
    <a href="/q/{community.name}" class="relative flex items-center gap-2 font-semibold">
      <Avatar src={community.avatar} />
      <span class="link link-hover">q/{community.name}</span>
    </a>
    <coreicons-shape-circle variant="filled" class="size-0.5"></coreicons-shape-circle>
    <span class="text-base-content/75">{new FormatDate(created_at).timeAgo()}</span>
  </div>
  <h2 class="text-info text-lg font-semibold">{title}</h2>
  <p class="text-sm font-normal">{content}</p>
  <PostActions class="mt-1" {id} {ratio} {upvotes} {downvotes} {comments} />
</div>
