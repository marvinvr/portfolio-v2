<script lang="ts">
  interface Props {
    title: string;
    description?: string;
  }

  let { title, description = "" }: Props = $props();
</script>

<section class="py-8">
  <div class="max-w-screen-xl mx-auto px-4 md:px-8">
    <div>
      <h3 class="text-gray-800 text-4xl font-semibold">{title}</h3>
      {#if description}
        <p class="text-gray-600 max-w-2xl">{description}</p>
      {/if}
    </div>
  </div>
</section>

