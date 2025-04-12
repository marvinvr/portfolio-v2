<script lang="ts">
  import { PUBLIC_ENVIRONMENT } from "$env/static/public";
</script>

<svelte:head>
  {#if PUBLIC_ENVIRONMENT === "production"}
    <script defer data-domain="marvinvr.ch" src="https://stats.mvr.bz/js/script.js"></script>
  {/if}
</svelte:head>
