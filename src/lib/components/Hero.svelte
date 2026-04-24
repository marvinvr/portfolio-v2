<script lang="ts">
  import MapMarkerOutline from "svelte-material-icons/MapMarkerOutline.svelte";

  // @ts-ignore
  import portrait from "$lib/assets/portrait.jpeg?format=webp&w=600&h=600";
  import Socials from "./Socials.svelte";

  interface Props {
    greetingName: string;
    tagline: string;
    location: string;
    subtitle: string;
    additionalActions?: import('svelte').Snippet;
  }

  let {
    greetingName,
    tagline,
    location,
    subtitle,
    additionalActions
  }: Props = $props();
</script>

<div>
  <section
    class="md:pt-24 mx-auto max-w-screen-xl pb-12 px-4 items-center flex-col-reverse lg:flex-row flex md:px-8 lg:justify-between"
  >
    <div class="space-y-5 flex-1 sm:text-center lg:text-left">
      <div>
        <h1 class="text-gray-900 font-semibold text-5xl xl:text-6xl leading-[1.1]">{greetingName}</h1>
        <h2 class="text-gray-700 font-normal text-xl xl:text-2xl mt-3">{tagline}</h2>
        <div class="flex items-center justify-start sm:justify-center lg:justify-start space-x-2 mt-3">
          <MapMarkerOutline class="w-4 h-4 text-gray-400" />
          <span class="text-sm text-gray-500">{location}</span>
        </div>
      </div>
      <div class="lg:pr-12 space-y-0">
        {#each subtitle.split("\\n") as line}
          <p class="text-gray-600 text-sm max-w-xl leading-relaxed sm:mx-auto lg:ml-0">
            {@html line}
          </p>
        {/each}
      </div>
      <div class="flex flex-col sm:flex-row gap-3 items-center w-full md:w-auto sm:justify-center lg:justify-start">
        {@render additionalActions?.()}
        <Socials />
      </div>
    </div>
    <div class="mt-7 lg:mt-0 mb-6 lg:mb-0 flex flex-col items-center">
      <img
        src={portrait}
        width="384"
        height="384"
        class="w-full sm:w-10/12 md:w-96 rounded-md border border-gray-200"
        alt="Portrait of Marvin von Rappard"
      />
    </div>
  </section>
</div>
