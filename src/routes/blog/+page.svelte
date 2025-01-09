<script lang="ts">
  import type { PageData } from "./$types";
  import Posts from "$lib/components/Posts.svelte";

  export let data: PageData;
  const { latestPosts } = data;
</script>

<svelte:head>
  <meta
    name="keywords"
    content="Marvin von Rappard, von Rappard, Switzerland, Baden, Data Scientist, Software Engineer, Deep Learning, Data, Science"
  />

  <link rel="canonical" href="https://marvinvr.ch/blog" />
  <meta property="og:url" content="https://marvinvr.ch/blog" />

  <meta property="og:title" content="Marvin von Rappard | Blog" />
  <title>Marvin von Rappard | Blog</title>
  <meta
    name="description"
    property="og:description"
    content="The personal blog of Marvin von Rappard. This is an overview of my recent posts and current projects I'm working on."
  />
</svelte:head>

<Posts title="My Recent Posts" posts={latestPosts} />
