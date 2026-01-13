<script lang="ts">
  import { cn } from '$lib/functions/classnames';
  import { create_form_data } from '$lib/functions/form';
  import Step_1 from '$lib/pages/q/create/step_1.svelte';
  import Step_2 from '$lib/pages/q/create/step_2.svelte';
  import Step_3 from '$lib/pages/q/create/step_3.svelte';
  import Step_4 from '$lib/pages/q/create/step_4.svelte';
  import { superForm } from 'sveltekit-superforms';

  // internal types
  type Step = keyof typeof steps;

  // dynamic mappings
  const steps = {
      0: {
        title: `Introduce your community`,
        helptext: `Give your community a name and a description that reflects its purpose and vibe.`,
        component: Step_1
      },
      1: {
        title: `Style your community`,
        helptext: `Adding visual flair will catch new members attention and help establish your community's culture!`,
        component: Step_2
      },
      2: {
        title: `Choose topics`,
        helptext: `Add up to 3 topics to help interested redditors find your community.`,
        component: Step_3
      },
      3: {
        title: `Set your community type`,
        helptext: `Decide who can view and contribute in your community. Only public communities show up in search.`,
        component: Step_4
      }
    },
    error_steps: Record<number, string[]> = {
      0: ['name', 'description'],
      1: ['avatar', 'banner'],
      2: ['topics'],
      3: ['type', 'nsfw']
    };

  let { data } = $props();

  let step = $state<Step>(0);
  const current_step = $derived(steps[step]);

  // constants
  const MAX_STEP = Object.keys(steps).length - 1;

  const { form, enhance, errors, delayed } = superForm(data.form, {
    resetForm: false,
    onSubmit({ formData }) {
      const _form_data = create_form_data($form);
      _form_data.forEach((value, key) => {
        formData.set(key, value);
      });
    },
    onResult({ result }) {
      if (result.type === 'failure' && result.data) {
        const first_error_key = Object.keys(result.data.form.errors)[0]!;
        const error_step = Object.keys(error_steps).find((key) =>
          error_steps[Number(key)]?.includes(first_error_key)
        );
        if (error_step) step = Number(error_step) as Step;
      } else if (result.type === 'error') {
        console.error('Unexpected error:', result.error);
      }
    }
  });

  function handle_back_click() {
    if (step > 0) {
      step--;
    }
  }

  function handle_next_click(e: Event) {
    if (step < MAX_STEP) {
      e.preventDefault();
      step++;
    }
  }
</script>

<svelte:head>
  <title>Create on Quibble</title>
</svelte:head>

<div class="flex h-max flex-1 flex-col gap-4 p-4">
  <div class="flex flex-col gap-2">
    <h1 class="text-info text-xl font-semibold">{current_step.title}</h1>
    <p class="text-sm">{current_step.helptext} You can customize its look and settings later.</p>
  </div>
  <form method="POST" enctype="multipart/form-data" class="flex flex-col gap-2" use:enhance>
    <!-- dynamic step rendering -->
    <current_step.component {form} {errors} />
    <!-- dynamic step rendering -->
    <div class="flex items-center justify-between">
      <!-- form step indicators -->
      <div class="flex items-center gap-2">
        {#each Object.keys(steps) as _step_idx}
          {@const is_active = step === Number(_step_idx)}
          <button
            type="button"
            class="bg-base-content size-2 rounded-full"
            class:opacity-50={!is_active}
            aria-label="Go to step {_step_idx}"
            onclick={() => (step = Number(_step_idx) as keyof typeof steps)}
          ></button>
        {/each}
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="btn btn-neutral"
          disabled={step === 0}
          onclick={handle_back_click}
        >
          <coreicons-shape-arrow variant="left" class="size-4"></coreicons-shape-arrow>
          Back
        </button>
        <button
          type={step === MAX_STEP ? 'submit' : 'button'}
          class={cn($delayed && 'btn-active pointer-events-none', 'btn btn-primary')}
          onclick={handle_next_click}
        >
          {step === MAX_STEP ? 'Create' : 'Next'}
          {#if $delayed}
            <span class="loading loading-spinner loading-xs"></span>
          {:else}
            <coreicons-shape-arrow variant="right" class="size-4"></coreicons-shape-arrow>
          {/if}
        </button>
      </div>
    </div>
  </form>
</div>
<div class="hidden w-80 lg:flex"></div>
