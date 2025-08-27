<script lang="ts">
    import { formatDate } from "$lib/utils/date";
    import { useLazyImage as lazyImage } from "svelte-lazy-image";
    import { onMount } from "svelte";

    interface Props {
        title: string;
        description?: string;
        children?: import('svelte').Snippet;
    }

    let { title, description = "", children }: Props = $props();

    interface YouTubeVideo {
        id: string;
        title: string;
        description: string;
        thumbnail: string;
        publishedAt: string;
        url: string;
    }

    let videos: YouTubeVideo[] = $state([]);
    let loading = $state(true);
    let error = $state(false);

    onMount(async () => {
        try {
            const response = await fetch(`/api/youtube`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch videos');
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            videos = data;
        } catch (e) {
            console.error('Error loading YouTube videos:', e);
            error = true;
        } finally {
            loading = false;
        }
    });
</script>

<section class="py-24">
    <div class="max-w-screen-xl mx-auto px-4 md:px-8">
        <div>
            <h2 class="text-gray-800">{title}</h2>
            {#if description}
                <p class="text-gray-600 max-w-2xl">{description}</p>
            {/if}
            {@render children?.()}
        </div>
        
        {#if loading}
            <div class="mt-12 flex justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        {:else if error}
            <div class="mt-12 text-center">
                <p class="text-gray-600">Unable to load videos at this time.</p>
            </div>
        {:else if videos.length > 0}
            <ul
                class="grid gap-x-8 mt-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
            >
                {#each videos as video (video.id)}
                    <li
                        class="w-full mx-auto group sm:max-w-sm rounded-md hover:bg-gray-50 transition p-3"
                    >
                        <a href={video.url} target="_blank" rel="noopener noreferrer">
                            <img
                                data-src={video.thumbnail}
                                use:lazyImage
                                alt={video.title}
                                height="192"
                                class="w-full rounded-md h-48 object-cover"
                            />
                            <div class="mt-3 space-y-2 mx-2 my-4">
                                <span class="block text-indigo-600 text-sm">
                                    {formatDate(video.publishedAt)}
                                </span>
                                <span class="text-lg text-gray-800 duration-150 font-semibold">
                                    {video.title}
                                </span>
                                <p
                                    class="text-gray-600 text-sm duration-150 group-hover:text-gray-800 line-clamp-3"
                                >
                                    {video.description || "No description available"}
                                </p>
                            </div>
                        </a>
                    </li>
                {/each}
            </ul>
        {:else}
            <div class="mt-12 text-center">
                <p class="text-gray-600">No videos found in this playlist.</p>
            </div>
        {/if}
    </div>
</section>