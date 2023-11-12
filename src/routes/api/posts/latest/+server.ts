import { json } from "@sveltejs/kit";
import { getPosts } from "../utils/posts";

export const prerender = true;

export async function GET() {
    const posts = (await getPosts()).slice(0, 3);
    return json(posts);
}