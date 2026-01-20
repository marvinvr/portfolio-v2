<script lang="ts">
    import Hero from "$lib/components/Hero.svelte";
    import HireMe from "$lib/components/HireMe.svelte";
    import { User, ArrowRight } from "lucide-svelte";
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();
</script>

<svelte:head>
    <meta property="og:title" content="Marvin von Rappard | Blog"/>
    <meta property="og:description"
          content="Full-Stack Engineer building Industrial AI. My blog posts usually center around Software / AI projects I've been working on."/>
    <meta property="og:image" content="https://marvinvr.ch/og-image.png"/>
    <meta property="og:type" content="website"/>

    <meta name="twitter:title" content="Marvin von Rappard | Blog"/>
    <meta name="twitter:description"
          content="Full-Stack Engineer building Industrial AI. My blog posts usually center around Software / AI projects I've been working on."/>
    <meta name="twitter:image" content="https://marvinvr.ch/og-image.png"/>
</svelte:head>

<Hero
    greetingSmall="Hey there,"
    greetingName="I'm Marvin"
    tagline="Full-Stack Engineer building Industrial AI"
    location="Zurich, Switzerland"
    subtitle="This is where you can find my blog posts. They usually center around some Software / AI project I've been working on.">
    {#snippet additionalActions()}
        <a href="/" class="group bg-slate-700 hover:bg-slate-800 transition-all duration-200 shadow-md hover:shadow-lg text-white px-5 py-2 rounded-md flex items-center gap-3 w-full md:w-auto justify-center">
            <User class="size-5" />
            <span>More about me</span>
            <ArrowRight class="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </a>
    {/snippet}
</Hero>
{@render children?.()}
<HireMe
    title="Want to Get in Touch?"
    subtitle="Do you have a question or want to discuss a project? Feel free to reach me anytime on any of these platforms:"
    description=""
/>