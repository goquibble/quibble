<script lang="ts" module>
  export interface ISettingItem {
    title: string;
    sub_title?: string;
    value?: string;
    aria_label: string;
    disabled?: boolean;
    is_dangerous?: boolean;
  }

  interface Props extends ISettingItem {
    onclick?: () => void;
  }
</script>

<script lang="ts">
  const { title, sub_title, value, aria_label, disabled, is_dangerous, onclick }: Props = $props();
</script>

<div class="flex items-center justify-between gap-2" class:text-error={is_dangerous}>
  <div class="flex flex-col">
    <span class="text-info text-sm">{title}</span>
    <span class="text-base-content/75 text-xs">{sub_title}</span>
  </div>
  <div class="flex items-center gap-2 text-xs">
    <span class="whitespace-nowrap">{value}</span>
    <button
      class="btn btn-xs btn-circle"
      class:btn-error={is_dangerous}
      aria-label={aria_label}
      {disabled}
      {onclick}
    >
      <coreicons-shape-chevron variant="right" class="size-4"></coreicons-shape-chevron>
    </button>
  </div>
</div>
