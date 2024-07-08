<script lang="ts">
  import { PUBLIC_CF_ANALYTICS_ID } from "$env/static/public";

  const src = `https://static.cloudflareinsights.com/beacon.min.js?token=${PUBLIC_CF_ANALYTICS_ID}`;
</script>

<svelte:head>
  <script defer {src}></script>
</svelte:head>
