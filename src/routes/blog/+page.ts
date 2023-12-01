import type { PageLoad } from './$types.js';
import type { Post } from '$lib/models/post.js';

export const prerender = true;

export const load: PageLoad = (async ({fetch}) => {
    const posts = await (await fetch('/api/posts/list')).json() as Post[]
    return {latestPosts: posts};
});