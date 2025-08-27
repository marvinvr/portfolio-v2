<script lang="ts">
  import Footer from "$lib/components/Footer.svelte";

  import "../app.scss";
  import Analytics from "$lib/components/Analytics.svelte";
  import { onMount } from "svelte";
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
  //import { HEYO } from '@heyo.so/js';

  onMount(() => {
    //HEYO.init({ projectId: "68a5dd5d654df4068e71a8a1" });
  });
</script>

<Analytics />
{@render children?.()}
<Footer />
