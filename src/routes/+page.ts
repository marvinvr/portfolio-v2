import type { Post } from "$lib/models/post";
import type { PageLoad } from "./$types";

export const load = (async ({ fetch }) => {
    const posts = await fetch('/api/posts').then(res => res.json()) as Post[];

    return {
        latestPosts: posts.slice(0, 3),
    }
}) satisfies PageLoad