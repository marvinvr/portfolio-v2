<script lang="ts">
  import { onMount } from "svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Analytics from "$lib/components/Analytics.svelte";
  import Galaxy from "$lib/components/space/Galaxy.svelte";
  import { space } from "$lib/space/spaceMode.svelte";

  import "../app.scss";
  import "$lib/space/space.scss";

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  // Galaxy only mounts after hydration so server and client markup match
  // (the persisted mode is only known on the client).
  let hydrated = $state(false);
  onMount(() => {
    hydrated = true;
  });
</script>

<Analytics />
{#if hydrated && space.on}
  <Galaxy />
{/if}
{@render children?.()}
<Footer />
