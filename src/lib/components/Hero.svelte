<script lang="ts">
  import MapMarkerOutline from "svelte-material-icons/MapMarkerOutline.svelte";

  // @ts-ignore
  import portrait from "$lib/assets/portrait.jpeg?format=webp&w=600&h=600";
  import Socials from "./Socials.svelte";
  import { Mail, ArrowRight } from "lucide-svelte";
  import { getEmailUrl } from "$lib/utils/email";

  interface Props {
    greetingSmall: string;
    greetingName: string;
    tagline: string;
    location: string;
    subtitle: string;
    additionalActions?: import('svelte').Snippet;
  }

  let {
    greetingSmall,
    greetingName,
    tagline,
    location,
    subtitle,
    additionalActions
  }: Props = $props();
</script>

<svelte:head>
  <title>Marvin von Rappard | Portfolio</title>
</svelte:head>

<div>
  <section
    class="md:pt-24 mx-auto max-w-screen-xl pb-12 px-4 items-center flex-col-reverse lg:flex-row flex md:px-8 lg:justify-between"
  >
    <div class="space-y-4 flex-1 sm:text-center lg:text-left">
      <h1>
        <span class="block text-gray-600 font-medium text-xl xl:text-2xl mb-1">{greetingSmall}</span>
        <span class="block text-gray-800 font-bold text-5xl xl:text-6xl">{greetingName}</span>
      </h1>
      <h2 class="text-gray-800 font-medium text-xl xl:text-2xl">
        {tagline}
      </h2>
      <!-- Location marker -->
      <div class="flex items-center justify-start sm:justify-center lg:justify-start space-x-2">
        <MapMarkerOutline class="w-5 h-5 text-gray-700" />
        <span class="text-gray-700">{location}</span>
      </div>
      <div>
        {#each subtitle.split("\\n") as line}
          <p class="text-gray-700 max-w-xl leading-relaxed sm:mx-auto lg:ml-0">
            {@html line}
          </p>
        {/each}
      </div>
      <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto sm:justify-center lg:justify-start">
        {@render additionalActions?.()}
        <button
          class="group border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md text-gray-700 px-5 py-2 rounded-md flex items-center gap-3 w-full md:w-auto justify-center"
          onclick={() => {
            window.open(getEmailUrl(), "_blank");
          }}
        >
          <Mail class="size-5" />
          <span>Get in touch</span>
          <ArrowRight class="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>
      <div class="block md:hidden pt-3">
        <Socials />
      </div>
    </div>
    <div class="mt-7 lg:mt-0 mb-6 lg:mb-0 flex flex-col items-center">
      <img
        src={portrait}
        width="384"
        height="384"
        class="w-full mb-8 sm:w-10/12 md:w-96 rounded-lg shadow-2xl"
        alt="Portrait of Marvin von Rappard"
      />
      <div class="hidden md:block">
        <Socials />
      </div>
    </div>
  </section>
</div>
