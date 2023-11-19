import { json } from '@sveltejs/kit';
import { getCategories } from '../utils/posts'

export const prerender = true;

export const GET = async ({}) => {
    return json(await getCategories());
};