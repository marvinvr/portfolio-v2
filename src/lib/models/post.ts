export type Categories = 'deep-learning' | 'natural-language-processing' | 'machine-learning' | 'computer-vision' | 'programming' | 'other'

export type Post = {
	title: string
	slug: string
	description: string
	date: string
	categories: Categories[]
	published: boolean
	header: string
}