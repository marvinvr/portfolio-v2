import {getCategories, getPosts} from "../../utils/posts";
import type {EntryGenerator} from "../../../../../../.svelte-kit/types/src/routes/posts/[slug]/$types";
import {json} from "@sveltejs/kit";
import type {PageLoad} from "../../../../../../.svelte-kit/types/src/routes/$types";

export const prerender = true;

export const GET: PageLoad = async ({ params }) => {
    const category = params.category
    const allPosts = await getPosts();
    
    return json(allPosts.filter(post => post.categories.includes(category)));
}

export const entries: EntryGenerator = async () => {
    const categories = await getCategories();
    return categories.map(category => ({slug: category}));
}