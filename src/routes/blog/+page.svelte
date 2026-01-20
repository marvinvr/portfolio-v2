<script lang="ts">
  import type { PageData } from "./$types";
  import Posts from "$lib/components/Posts.svelte";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  const { latestPosts } = data;
</script>

<svelte:head>
  <meta
    name="keywords"
    content="Marvin von Rappard, von Rappard, Switzerland, Zurich, Full Stack Engineer, Deep Learning, Machine Learning, AI, Blog"
  />

  <link rel="canonical" href="https://marvinvr.ch/blog" />
  <meta property="og:url" content="https://marvinvr.ch/blog" />

  <meta property="og:title" content="Marvin von Rappard | Blog" />
  <title>Marvin von Rappard | Blog</title>
  <meta
    name="description"
    property="og:description"
    content="Full-Stack Engineer building Industrial AI. My blog posts usually center around Software / AI projects I've been working on."
  />
</svelte:head>

<Posts title="My Recent Posts" posts={latestPosts} />
