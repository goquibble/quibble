<script lang="ts">
  import autosize from '$lib/actions/autosize';
  import type { components } from '$lib/api';
  import { cn } from '$lib/functions/classnames';
  import { auth_store } from '$lib/stores/auth.svelte';
  import { CommentCreateSchema } from '../schemas';
  import { onMount } from 'svelte';
  import { defaults, superForm } from 'sveltekit-superforms';
  import { zod } from 'sveltekit-superforms/adapters';

  type Comment = components['schemas']['Comment'];

  type Props = {
    path?: string;
    oncancel: () => void;
    oncomment: (data: { comment: Comment }) => void;
  };

  let { path, oncancel, oncomment }: Props = $props();
  let textarea_el = $state<HTMLTextAreaElement>();

  const { form, errors, enhance, delayed } = superForm(defaults(zod(CommentCreateSchema)), {
    onResult({ result }) {
      if (result.type === 'success' && result.data) {
        oncomment(result.data as { comment: Comment });
      }
    }
  });

  onMount(() => {
    textarea_el?.focus();
  });
</script>

<div class="flex flex-col gap-1">
  <form
    method="POST"
    action="?/comment"
    class="border-base-content/20 focus-within:border-base-content/50 rounded-box flex flex-col border"
    class:border-error!={$errors.content}
    use:enhance
  >
    <input type="hidden" name="path" value={path} />
    <textarea
      name="content"
      class="placeholder:text-base-content/75 max-h-40 min-h-10 bg-transparent p-2.5 text-sm leading-normal outline-hidden"
      placeholder="Add a comment..."
      use:autosize
      bind:this={textarea_el}
      bind:value={$form.content}
    ></textarea>
    <div class="flex w-full items-center gap-2 p-2">
      <button type="button" class="btn btn-ghost btn-sm ml-auto" onclick={oncancel}>Cancel</button>
      <button
        class={cn($delayed && 'btn-active pointer-events-none', 'btn btn-primary btn-sm')}
        disabled={!auth_store.value.is_authenticated}
      >
        Comment
        {#if $delayed}
          <span class="loading loading-spinner loading-xs"></span>
        {:else}
          <coreicons-shape-message-circle class="size-4"></coreicons-shape-message-circle>
        {/if}
      </button>
    </div>
  </form>
  {#if $errors.content}
    <div class="text-error flex items-center gap-2 text-xs">{$errors.content}</div>
  {/if}
</div>
