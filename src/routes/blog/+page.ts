import { getPosts } from '../api/posts/utils/posts.js';

export const prerender = true;

export const load = (async () => {
    const posts = getPosts();
    return {posts};
});