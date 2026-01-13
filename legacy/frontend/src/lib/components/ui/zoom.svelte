<script lang="ts">
  import Zoom from 'svelte-medium-image-zoom';

  let { children } = $props();
</script>

<Zoom class_button="btn" zoom_margin={10}>
  <!-- custom unzoom zoom buttons -->
  {#snippet icon_zoom()}
    <coreicons-shape-expand class="size-5"></coreicons-shape-expand>
  {/snippet}
  {#snippet icon_unzoom()}
    <coreicons-shape-shrink class="size-5"></coreicons-shape-shrink>
  {/snippet}
  <!-- custom zoom content -->
  {#snippet zoom_content({ img, button_unzoom, modal_state })}
    <!-- zoomed image -->
    {@render img()}
    <div
      class="opacity-0 transition-opacity"
      class:opacity-100={modal_state === 'LOADING' || modal_state === 'LOADED'}
    >
      {@render button_unzoom()}
    </div>
  {/snippet}

  {@render children()}
</Zoom>
