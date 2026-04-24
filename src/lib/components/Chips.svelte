<script lang="ts">
  interface Props {
    options: string[];
    selectedOption: string;
  }

  let { options, selectedOption }: Props = $props();
</script>

<div class="flex overflow-x-auto py-4 gap-2">
  {#each options as option}
    <a
      href="/blog/{option}/"
      class="bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 px-4 transition rounded-sm focus:outline-none focus:shadow-outline whitespace-nowrap text-sm border border-gray-200"
      class:!bg-gray-800={selectedOption === option}
      class:!text-white={selectedOption === option}
      class:!border-gray-800={selectedOption === option}
      type="button"
    >
      {option}
    </a>
  {/each}
</div>
