<script lang="ts">
    import { useLazyImage as lazyImage } from "svelte-lazy-image";
    import SectionHeader from "./SectionHeader.svelte";

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
    <SectionHeader {title} />

    <div class="mt-8">
        {#each items as item}
            <div class="flex gap-x-4">
                <!-- Icon -->
                <div
                    class="relative after:absolute after:top-10 after:bottom-1.5 after:start-4 after:w-0 after:border-l after:border-dashed after:border-gray-400 after:-translate-x-[0.5px]">
                    <div class="relative z-10 w-8 h-8 flex justify-center items-center">
                        <a href={item.link} target="_blank">
                            <img use:lazyImage class="flex-shrink-0 w-8 h-8 rounded-md border border-gray-200" height="32" width="32" data-src={item.icon} alt={`${item.title} logo`}>
                        </a>
                    </div>
                </div>
                <!-- End Icon -->

                <!-- Right Content -->
                <div class="pb-8 flex-1">
                    <span class="block font-mono text-xs text-gray-500 mb-1">
                        {item.date}
                    </span>
                    <span class="block font-semibold text-gray-800">
                        {item.title}
                    </span>
                    <span class="block text-sm text-gray-500">
                        {item.position}
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
        <div class="flex gap-x-4">
            <div class="w-8 flex justify-center">
                <div class="w-2 h-2 bg-sky-700"></div>
            </div>
        </div>
    </div>
</div>
<!-- End Timeline -->
