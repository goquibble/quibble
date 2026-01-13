<script lang="ts">
  import autosize from '$lib/actions/autosize';
  import type {
    CommunityCreateErrorsType,
    CommunityCreateFormType
  } from '$lib/schemas/community-create';

  type Props = {
    form: CommunityCreateFormType;
    errors: CommunityCreateErrorsType;
  };

  let { form, errors }: Props = $props();
</script>

<fieldset class="fieldset">
  <label class="floating-label">
    <span class="bg-base-300! text-base duration-100!">Name*</span>
    <div class="input w-full gap-0 bg-transparent" class:input-error={$errors.name}>
      <span>q/</span>
      <input
        name="name"
        placeholder="Name*"
        aria-invalid={$errors.name ? 'true' : undefined}
        bind:value={$form.name}
        onkeydown={(e) => e.key === ' ' && e.preventDefault()}
      />
    </div>
  </label>
  <span class="fieldset-label" class:text-error={$errors.name}>
    <span>{$errors.name ? $errors.name[0] : 'Think of a name that grabs attention!'}</span>
    <span class="ml-auto">{$form.name.length}/25</span>
  </span>
</fieldset>
<fieldset class="fieldset">
  <textarea
    use:autosize
    name="description"
    class="textarea max-h-80 min-h-40 w-full bg-transparent leading-normal"
    class:textarea-error={$errors.description}
    placeholder="Description*"
    maxlength={255}
    bind:value={$form.description}
  ></textarea>
  <span class="fieldset-label" class:text-error={$errors.description}>
    <span
      >{$errors.description
        ? $errors.description[0]
        : 'Let others know what your community is for.'}</span
    >
    <span class="ml-auto">{$form.description.length}/255</span>
  </span>
</fieldset>
