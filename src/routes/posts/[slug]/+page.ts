import { error } from '@sveltejs/kit'
import type { PageLoad } from './$types'
import type { Post } from '$lib/models/post'

export const load = (async ({ params }) => {
	const { slug } = params
	try {
		const post = await import(`../../../posts/${slug}.md`)

		if (!post.metadata.published) error(404, `Could not find ${params.slug}`);

		return {
			content: post.default as ConstructorOfATypedSvelteComponent,
			meta: post.metadata as Post,
			slug
		}
	} catch (e) {
		error(404, `Could not find ${params.slug}`);
	}
}) satisfies PageLoad
