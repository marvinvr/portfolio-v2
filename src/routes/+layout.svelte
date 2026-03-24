<script lang="ts">
  import Footer from "$lib/components/Footer.svelte";
  import Analytics from "$lib/components/Analytics.svelte";

  import "../app.scss";

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<Analytics />
{@render children?.()}
<Footer />
