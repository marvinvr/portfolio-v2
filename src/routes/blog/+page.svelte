<script lang="ts">
  import type { PageData } from "./$types";
  import Posts from "$lib/components/Posts.svelte";

  export let data: PageData;
  const { latestPosts } = data;
</script>

<svelte:head>
  <link rel="canonical" href="https://marvinvr.ai/blog" />
  <meta property="og:url" content="https://marvinvr.ai/blog" />

  <meta property="og:title" content="Marvin von Rappard | Blog" />
  <title>Marvin von Rappard | Blog</title>
  <meta
    name="description"
    property="og:description"
    content="The personal blog of Marvin von Rappard. I'm a Data Scientist located in Baden, Switzerland. This is an overview of my recent posts and current projects i'm working on."
  />
</svelte:head>

<Posts title="My Recent Posts" posts={latestPosts} />
