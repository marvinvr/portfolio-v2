import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import type { Post } from '$lib/models/post'

export const load = (async ({ params }) => {
	const { slug } = params
	try {
		const post = await import(`../../../posts/${slug}.md`)

		return {
			content: post.default as ConstructorOfATypedSvelteComponent,
			meta: post.metadata as Post,
			slug
		}
	} catch (e) {
		throw error(404, `Could not find ${params.slug}`)
	}
}) satisfies PageLoad
