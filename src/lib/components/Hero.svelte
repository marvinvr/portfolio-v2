<script lang="ts">
  import MapMarkerOutline from "svelte-material-icons/MapMarkerOutline.svelte";

  // @ts-ignore
  import portrait from "$lib/assets/portrait.jpeg?format=webp&w=600&h=600";
  import Socials from "./Socials.svelte";

  export let greeting: string;
  export let tagline: string;
  export let location: string;
  export let subtitle: string;
</script>

<svelte:head>
  <title>Marvin von Rappard | Portfolio</title>
</svelte:head>

<div>
  <section
    class="md:pt-24 mx-auto max-w-screen-xl pb-12 px-4 items-center flex-col-reverse lg:flex-row flex md:px-8"
  >
    <div class="space-y-4 flex-1 sm:text-center lg:text-left">
      <h1 class="text-gray-800 font-semibold text-4xl xl:text-5xl">
        {greeting}
      </h1>
      <h2 class="text-gray-800 font-medium text-xl xl:text-2xl">
        {tagline}
      </h2>
      <!-- Location marker -->
      <a
        href="https://maps.app.goo.gl/R5u3Xi7rhmvvguwU9"
        aria-label="Baden, Switzerland"
        class="flex items-center justify-start sm:justify-center lg:justify-start space-x-2"
      >
        <MapMarkerOutline class="w-5 h-5 text-gray-700" />
        <span class="text-gray-700">{location}</span>
      </a>
      <div>
        {#each subtitle.split("\\n") as line}
          <p class="text-gray-700 max-w-xl leading-relaxed sm:mx-auto lg:ml-0">
            {@html line}
          </p>
        {/each}
      </div>
      <Socials />
    </div>
    <div class="flex-1 text-center mt-7 lg:mt-0 lg:ml-3 mb-6 lg:mb-0">
      <img
        src={portrait}
        width="384"
        height="384"
        class="w-full mx-auto sm:w-10/12 md:w-96 rounded-lg shadow-2xl"
        alt="Portrait of Marvin von Rappard"
      />
    </div>
  </section>
</div>
