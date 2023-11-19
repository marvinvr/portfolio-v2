import {getCategories} from "../api/posts/utils/posts";
import type {LayoutLoad} from "../../../.svelte-kit/types/src/routes/blog/$types";

export const load: LayoutLoad = async ({}) => {
    const categories = await getCategories();
    
    return {
        categories,
    }
}