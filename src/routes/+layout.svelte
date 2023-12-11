<script>
    import Footer from "$lib/components/Footer.svelte";
    import {dev} from "$app/environment";
    import {inject} from "@vercel/analytics";
    import {injectSpeedInsights} from '@vercel/speed-insights/sveltekit';

    inject({mode: dev ? 'development' : 'production'});

    injectSpeedInsights();

    import "../app.scss";
</script>

<slot/>
<Footer/>
