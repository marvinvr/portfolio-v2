<script lang="ts">
    import type {PageData} from "./$types";
    import Posts from "$lib/components/Posts.svelte";


    export let data: PageData;
    const {latestPosts} = data;
</script>

<svelte:head>
  <link rel="canonical" href="https://marvinvr.ai/blog/" />
  <meta property="og:url" content="https://marvinvr.ai/blog/" />
</svelte:head>


<Posts
    title="My Recent Posts"
    posts={latestPosts}>
</Posts>