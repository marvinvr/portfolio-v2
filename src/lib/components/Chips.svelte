<script lang="ts">
  interface Props {
    options: string[];
    selectedOption: string;
  }

  let { options, selectedOption }: Props = $props();
</script>

<div class="flex overflow-x-auto py-4 space-x-2">
  {#each options as option}
    <a
      href="/blog/{option}/"
      class="bg-gray-50 hover:bg-gray-200 text-gray-700 py-2 px-4 transition rounded-full focus:outline-none focus:shadow-outline whitespace-nowrap"
      class:bg-gray-300={selectedOption === option}
      type="button"
    >
      {option}
    </a>
  {/each}
</div>
