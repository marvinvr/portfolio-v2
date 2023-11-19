<script lang="ts">
    import type {PageData} from "./$types";
    import Posts from "$lib/components/Posts.svelte";


    export let data: PageData;
    const {latestPosts} = data;
</script>


<Posts
    title="My Recent Posts"
    posts={latestPosts}>
</Posts>