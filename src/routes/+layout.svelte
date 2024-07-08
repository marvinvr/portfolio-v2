<script lang="ts">
  import Footer from "$lib/components/Footer.svelte";

  import "../app.scss";
  import Analytics from "$lib/components/Analytics.svelte";
</script>

<Analytics />
<slot />
<Footer />
