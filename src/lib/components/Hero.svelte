<script lang="ts">

    import MapMarkerOutline from 'svelte-material-icons/MapMarkerOutline.svelte';

    // @ts-ignore
    import portrait from "$lib/assets/portrait.jpeg?format=webp&w=600&h=600";
  import Socials from "./Socials.svelte";
</script>

<svelte:head>
    <title>Marvin von Rappard | Portfolio</title>
</svelte:head>

<div>
    <section class="pt-24 mx-auto max-w-screen-xl pb-12 px-4 items-center lg:flex md:px-8">
        <div class="space-y-4 flex-1 sm:text-center lg:text-left">
            <h1 class="text-gray-800 font-semibold text-4xl xl:text-5xl">
                Hi! I'm
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#E114E5]"> Marvin von Rappard</span>
            </h1>
            <h2 class="text-gray-800 font-medium text-xl xl:text-2xl">
                Data Scientist & Bachelors of Science Student
            </h2>
            <!-- Location marker -->
            <a href="https://maps.app.goo.gl/R5u3Xi7rhmvvguwU9" aria-label="Baden, Switzerland" class="flex items-center justify-start sm:justify-center lg:justify-start space-x-2">
                <MapMarkerOutline class="w-5 h-5 text-gray-700" />
                <span class="text-gray-700">Baden, Switzerland</span>
            </a>
            <p class="text-gray-700 max-w-xl leading-relaxed sm:mx-auto lg:ml-0">
                Currently working at Apiax as part of a dynamic team developing state-of-the-art compliance AI, harnessing the power of natural language processing and advanced technologies like LLMs. In addition, I'm studying Data Science at the University of Applied Sciences.
            </p>
            <Socials />
            <div class="pt-10 items-center justify-center space-y-3 sm:space-x-6 sm:space-y-0 sm:flex lg:justify-start">
                <button on:click={() => document.getElementById('contact-me')?.scrollIntoView({behavior: 'smooth'})} class="px-7 py-3 w-full bg-gray-700 hover:bg-gray-800 transition text-gray-200 text-center rounded-md block sm:w-auto">
                    Get in touch
                </button>
            </div>
        </div>
        <div class="flex-1 text-center mt-7 lg:mt-0 lg:ml-3">
            <img src={portrait} width="384" height="384" class="w-full mx-auto sm:w-10/12  md:w-96 rounded-lg shadow-2xl" alt="Portrait of Marvin von Rappard" />
        </div>
    </section>
</div>