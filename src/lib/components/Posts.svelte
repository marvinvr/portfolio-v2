<script lang="ts">
    import type {Post} from "$lib/models/post";
    import {formatDate} from "$lib/utils/date";

    import {useLazyImage as lazyImage} from "svelte-lazy-image";

    import {thumbnail} from "$lib/utils/images";
    import SectionHeader from "./SectionHeader.svelte";

    interface Props {
        title: string;
        description?: string;
        posts?: Post[];
        children?: import('svelte').Snippet;
    }

    let {
        title,
        description = "",
        posts = [],
        children
    }: Props = $props();
</script>

<section class="py-24">
    <div class="max-w-screen-xl mx-auto px-4 md:px-8">
        <SectionHeader {title} {description}>
            {@render children?.()}
        </SectionHeader>
        <ul
            class="grid gap-x-8 mt-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
            class:mt-12={description}
        >
            {#each posts as post (post.title)}
                <li
                    class="w-full group sm:max-w-sm"
                >
                    <a href={`/posts/${post.slug}`}>
                        <img
                            data-src={thumbnail(post.slug, post.header)}
                            use:lazyImage
                            alt={post.title}
                            class="w-full rounded-md aspect-[1200/630] object-cover border border-gray-200"
                        />
                        <div class="mt-3 space-y-2">
                            <div>
                                <span class="font-mono text-xs text-gray-500">{formatDate(post.date)}</span>
                            </div>
                            <span class="text-lg text-gray-800 duration-150 font-semibold block">
                                {post.title}
                            </span>
                            <p
                                class="text-gray-600 text-sm duration-150 group-hover:text-gray-800"
                            >
                                {post.description}
                            </p>
                        </div>
                    </a>
                </li>
            {/each}
        </ul>
    </div>
</section>
