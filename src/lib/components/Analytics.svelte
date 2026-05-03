<script lang="ts">
  import { PUBLIC_ENVIRONMENT } from "$env/static/public";
</script>

<svelte:head>
  {#if PUBLIC_ENVIRONMENT === "production"}
    <script
      src="https://stats.marvinvr.ch/api/script.js"
      data-site-id="008653442f42"
      defer
    ></script>
  {/if}
</svelte:head>
