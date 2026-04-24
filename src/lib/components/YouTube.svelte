<script lang="ts">
    import { formatDate } from "$lib/utils/date";
    import { useLazyImage as lazyImage } from "svelte-lazy-image";
    import { onMount } from "svelte";
    import { ArrowRightIcon } from "lucide-svelte";
    import SectionHeader from "./SectionHeader.svelte";

    interface Props {
        title: string;
        description?: string;
        children?: import('svelte').Snippet;
    }

    let { title, description = "", children }: Props = $props();

    function truncate(text: string, maxLength: number = 150): string {
        if (!text || text.length <= maxLength) return text;
        return text.slice(0, maxLength).trim() + "...";
    }

    interface YouTubeVideo {
        id: string;
        title: string;
        description: string;
        thumbnail: string;
        publishedAt: string;
        url: string;
    }

    let videos: YouTubeVideo[] = $state([]);
    let playlistUrl: string = $state("");
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

            const { videos: newVideos, playlistUrl: newPlaylistUrl } = data;
            
            videos = newVideos;
            playlistUrl = newPlaylistUrl;
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
        <SectionHeader {title} {description}>
            {#if description}
                <a href={playlistUrl} target="_blank" rel="noopener noreferrer" class="text-sm font-medium">view all on youtube →</a>
            {/if}
            {@render children?.()}
        </SectionHeader>

        {#if loading}
            <div class="mt-12 flex justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-700"></div>
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
                        class="w-full group sm:max-w-sm"
                    >
                        <a href={video.url} target="_blank" rel="noopener noreferrer">
                            <img
                                data-src={video.thumbnail}
                                use:lazyImage
                                alt={video.title}
                                class="w-full rounded-md aspect-[1200/630] object-cover border border-gray-200"
                            />
                            <div class="mt-3 space-y-2">
                                <div>
                                    <span class="font-mono text-xs text-gray-500">
                                        {formatDate(video.publishedAt)}
                                    </span>
                                </div>
                                <span class="text-lg text-gray-800 duration-150 font-semibold block">
                                    {video.title}
                                </span>
                                <p class="text-gray-600 text-sm duration-150 group-hover:text-gray-800">
                                    {truncate(video.description) || "No description available"}
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
