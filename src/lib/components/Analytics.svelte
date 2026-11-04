<script lang="ts">
  import { env } from "$env/dynamic/public";
</script>

<svelte:head>
  {#if env.PUBLIC_ENVIRONMENT === "production"}
    <script
      src="https://stats.marvinvr.ch/api/script.js"
      data-site-id="008653442f42"
      defer
    ></script>
  {/if}
</svelte:head>
