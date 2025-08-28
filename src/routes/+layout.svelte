<script lang="ts">
  import Footer from "$lib/components/Footer.svelte";

  import "../app.scss";
  import Analytics from "$lib/components/Analytics.svelte";
  import { onMount } from "svelte";
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<Analytics />
{@render children?.()}
<Footer />
