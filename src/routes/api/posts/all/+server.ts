import { json } from '@sveltejs/kit'
import { getPosts } from '../utils/posts'

export const prerender = true;

export async function GET() {
	const posts = await getPosts()
	return json(posts)
}
