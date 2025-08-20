<script lang="ts">
  import { MailIcon, SquareKanban } from "lucide-svelte";
  import { getEmailUrl } from "$lib/utils/email";

  export let title: string;
  export let subtitle: string;
  export let description: string;
  export let buttonText: string;
</script>

<section class="py-16">
  <div class="max-w-screen-xl mx-auto px-4 md:px-8 text-center">
    <div class="space-y-6">
      <h2 class="text-gray-900 font-bold text-4xl xl:text-5xl">
        {title}
      </h2>
      <p class="text-gray-600 text-lg xl:text-xl max-w-2xl mx-auto">
        {subtitle}
      </p>
      <p class="text-gray-700 max-w-3xl mx-auto leading-relaxed">
        {description}
      </p>
      <div class="pt-4">
        <button
          class="bg-slate-700 hover:bg-slate-800 transition-all duration-200 shadow-md hover:shadow-lg text-white px-6 py-3 rounded-md flex items-center flex-row gap-3 mx-auto text-md font-medium"
          on:click={() => {
            window.open(getEmailUrl(), "_blank");
          }}
        >
          <MailIcon class="size-5" />
          <span>{buttonText}</span>
        </button>
      </div>
    </div>
  </div>
</section>