<script lang="ts">
  import type { components } from '$lib/api';
  import Avatar from '$lib/components/ui/avatar.svelte';
  import { cn } from '$lib/functions/classnames';
  import { FormatDate } from '$lib/functions/date';
  import type { CommentTree } from '$lib/types/comment';
  import CommentActions from './comment-actions.svelte';
  import CommentBlock from './comment-block.svelte';
  import CommentBox from './comment-box.svelte';

  type Comment = components['schemas']['Comment'];

  interface Props extends CommentTree {
    on_delete?: (id: number) => void;
  }

  let { on_delete, ...comment_prop }: Props = $props();
  let comment = $state(comment_prop);

  let collapsed = $state(comment.collapsed);
  let show_comment_box = $state(false);

  function toggle_collapse() {
    collapsed = !collapsed;
  }

  async function handle_comment(data: { comment: Comment }) {
    show_comment_box = false;

    const new_comment: CommentTree = { ...data.comment, children: [], collapsed: false };
    comment.children.unshift(new_comment);
  }
</script>

<div class="flex items-start gap-2">
  {#if collapsed}
    <button
      onclick={toggle_collapse}
      class="btn btn-neutral ml-1 size-6 rounded-full p-0"
      aria-label="toggle collapse"
    >
      <coreicons-shape-plus variant="circle" class="size-4"></coreicons-shape-plus>
    </button>
  {:else}
    <div class="flex flex-col items-center gap-2 self-stretch">
      {#if comment.deleted}
        <Avatar class="size-8 shrink-0" />
      {:else}
        <a href="/u/{comment.commenter?.username}">
          <Avatar src={comment.commenter?.avatar} class="size-8 shrink-0" />
        </a>
      {/if}
      <button
        onclick={toggle_collapse}
        aria-label="toggle collapse"
        class="group grid size-full cursor-pointer place-items-center"
      >
        <div
          class="bg-neutral group-hover:bg-primary h-full w-px rounded-full transition-colors
        group-hover:w-0.5"
        ></div>
      </button>
    </div>
  {/if}
  <div class={cn(collapsed && 'ml-1 self-center', 'flex w-full flex-col gap-2')}>
    <div class="flex items-center gap-1.5">
      {#if comment.deleted}
        <h3 class="text-xs font-semibold">[deleted]</h3>
      {:else}
        <a
          href="/u/{comment.commenter?.username}"
          class="hover:text-accent flex items-center gap-2 hover:underline"
        >
          <h3 class="text-xs font-semibold">u/{comment.commenter?.username}</h3>
        </a>
      {/if}
      <coreicons-shape-circle variant="filled" class="text-base-content/75 size-0.5"
      ></coreicons-shape-circle>
      <span class="text-base-content/75 text-xs font-medium"
        >{new FormatDate(comment.created_at).timeAgo()}</span
      >
    </div>
    <div class="flex flex-col gap-2" class:hidden={collapsed}>
      <p class="text-info text-sm whitespace-pre-wrap">{comment.content}</p>
      <!-- comment options -->
      <CommentActions
        {...comment}
        on_reply_click={() => (show_comment_box = true)}
        on_delete={() => on_delete?.(comment.id)}
      />
      {#if show_comment_box}
        <!-- reply comment -->
        <CommentBox
          path={comment.path}
          oncancel={() => (show_comment_box = false)}
          oncomment={handle_comment}
        />
      {/if}
      <!-- extra space -->
      <div></div>
      <!-- render reply comments if any -->
      {#if comment.children && comment.children.length > 0}
        {#each comment.children as child}
          <CommentBlock {...child} on_delete={() => on_delete?.(child.id)} />
        {/each}
      {/if}
    </div>
  </div>
</div>
