<script lang="ts">
    export let title: string
    export let items: {
        date: string,
        title: string,
        position: string,
        link: string,
        description: string,
        icon: any
    }[] = []

    // @ts-ignore
    import portrait from "$lib/assets/portrait.jpeg?format=webp&w=200&h=200";

    import { useLazyImage as lazyImage } from "svelte-lazy-image";
</script>

<!-- Timeline -->
<div class="max-w-screen-xl mx-auto mt-12 px-4 md:px-8">

    <!-- Title -->
    <h2 class="text-gray-800 mb-4">
        {title}
    </h2>
    <!-- Item -->
    {#each items as item}
        <div class="flex gap-x-3 rounded-lg">
            <div class="w-16 md:w-32 text-end">
                <div class="text-xs text-gray-500 mt-1">{item.date}</div>
            </div>
            <!-- End Left Content -->

            <!-- Icon -->
            <div
                class="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 ">
                <div class="relative z-10 w-7 h-7 flex justify-center items-center">
                    <a href={item.link} target="_blank">
                        <img use:lazyImage class="flex-shrink-0 w-7 h-7 rounded-full" height="28" width="28" data-src={item.icon} alt={`${item.title} logo`}>
                    </a>
                </div>
            </div>
            <!-- End Icon -->

            <!-- Right Content -->
            <div class="pt-0.5 pb-8 w-11/12 md:w-9/12">
            <span class="flex gap-x-1.5 font-semibold text-gray-800 ">
                {item.title}
            </span>
                <span
                    class="mt-1 -ms-1 p-1 inline-flex items-center gap-x-2 text-sm rounded-lg border border-transparent text-gray-500 disabled:opacity-50 disabled:pointer-events-none     ">
            <img use:lazyImage class="flex-shrink-0 w-5 h-5 rounded-full" height="20" width="20" data-src={portrait} alt="Portrait of Marvin von Rappard">
                    {item.position}
            </span>
                <p class="mt-1 text-sm text-gray-600 ">
                    {item.description}
                </p>
            </div>
            <!-- End Right Content -->
        </div>
        <!-- End Item -->
    {/each}
</div>
<!-- End Timeline -->