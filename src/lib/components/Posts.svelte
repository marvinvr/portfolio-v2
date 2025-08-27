<script lang="ts">
    import type {Post} from "$lib/models/post";
    import {formatDate} from "$lib/utils/date";

    import {useLazyImage as lazyImage} from "svelte-lazy-image";

    import {thumbnail} from "$lib/utils/images";

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
        <div>
            <h2 class="text-gray-800">{title}</h2>
            {#if description}
                <p class="text-gray-600 max-w-2xl">{description}</p>
            {/if}
            {@render children?.()}
        </div>
        <ul
            class="grid gap-x-8 mt-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
            class:mt-12={description}
        >
            {#each posts as post (post.title)}
                <li
                    class="w-full mx-auto group sm:max-w-sm rounded-md hover:bg-gray-50 transition p-3"
                >
                    <a href={`/posts/${post.slug}`}>
                        <img
                            data-src={thumbnail(post.slug, post.header)}
                            use:lazyImage
                            alt={post.title}
                            height="192"
                            class="w-full rounded-md h-48 object-cover"
                        />
                        <div class="mt-3 space-y-2 mx-2 my-4">
              <span class="block text-indigo-600 text-sm"
              >{formatDate(post.date)}</span
              >
                            <span class="text-lg text-gray-800 duration-150 font-semibold">
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
