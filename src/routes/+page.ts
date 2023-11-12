import type { Post } from "$lib/models/post";
import type { PageLoad } from "./$types";

export const load = (async ({ fetch }) => {
    const latestPosts = await fetch('/api/posts/latest').then(res => res.json()) as Post[];

    return {
        latestPosts,
    }
}) satisfies PageLoad