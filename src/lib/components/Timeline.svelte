<script lang="ts">
    import { useLazyImage as lazyImage } from "svelte-lazy-image";

    interface Props {
        title: string;
        items?: {
            date: string;
            title: string;
            position: string;
            link: string;
            description: string;
            icon: any;
        }[];
    }

    let { title, items = [] }: Props = $props();
</script>

<!-- Timeline -->
<div class="max-w-screen-xl mx-auto mt-12 px-4 md:px-8">
    <!-- Title -->
    <h2 class="text-gray-800 text-xl font-semibold mb-6">
        {title}
    </h2>
    <!-- Item -->
    {#each items as item}
        <div class="flex gap-x-3 rounded-lg">
            <!-- Icon -->
            <div
                class="relative after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-gray-200">
                <div class="relative z-10 w-8 h-8 flex justify-center items-center">
                    <a href={item.link} target="_blank">
                        <img use:lazyImage class="flex-shrink-0 w-8 h-8 rounded-full" height="32" width="32" data-src={item.icon} alt={`${item.title} logo`}>
                    </a>
                </div>
            </div>
            <!-- End Icon -->

            <!-- Right Content -->
            <div class="pb-8">
                <span class="block font-semibold text-gray-800">
                    {item.title}
                </span>
                <span class="block text-sm text-gray-500">
                    {item.position} · {item.date}
                </span>
                <p class="mt-2 text-sm text-gray-600">
                    {item.description}
                </p>
            </div>
            <!-- End Right Content -->
        </div>
        <!-- End Item -->
    {/each}
    <!-- End dot -->
    <div class="flex gap-x-3">
        <div class="w-8 flex justify-center">
            <div class="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
    </div>
</div>
<!-- End Timeline -->