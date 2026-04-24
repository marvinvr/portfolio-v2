<script lang="ts">
  interface Props {
    title: string;
    description?: string;
    children?: import('svelte').Snippet;
  }

  let { title, description, children }: Props = $props();
</script>

<div>
  <h2 class="text-gray-800 text-xl font-semibold">{title}</h2>
  {#if description}
    <p class="text-gray-600 max-w-2xl mt-2">{description}</p>
  {/if}
  {#if children}
    <div class="mt-2">
      {@render children()}
    </div>
  {/if}
</div>
