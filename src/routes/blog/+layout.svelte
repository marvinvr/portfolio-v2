<script lang="ts">
    import Hero from "$lib/components/Hero.svelte";
    import Contact from "$lib/components/Contact.svelte";
    import { User } from "lucide-svelte";
    interface Props {
        children?: import('svelte').Snippet;
    }

    let { children }: Props = $props();
</script>

<svelte:head>
    <meta property="og:title" content="Marvin von Rappard | Blog"/>
    <meta property="og:description"
          content="The personal blog of Marvin von Rappard. I'm a Data Scientist located in Baden, Switzerland. My posts usually center around Deep Learning and Computer Science."/>
    <meta property="og:image" content="https://marvinvr.ch/og-image.png"/>
    <meta property="og:type" content="website"/>

    <meta name="twitter:title" content="Marvin von Rappard | Blog"/>
    <meta name="twitter:description"
          content="The personal blog of Marvin von Rappard. I'm a Data Scientist located in Baden, Switzerland. My posts usually center around Deep Learning and Computer Science."/>
    <meta name="twitter:image" content="https://marvinvr.ch/og-image.png"/>
</svelte:head>

<Hero
    greeting="Hey, I'm Marvin"
    tagline="Full-Stack Engineer / Data Scientist"
    location="Baden, Switzerland"
    subtitle="This is where you can find my most recent blog posts. Usually in the domain of Artificial Intelligence. Use any of the links below to get in touch!">
    {#snippet additionalActions()}
        <a href="/" class="bg-slate-700 hover:bg-slate-800 transition-all duration-200 shadow-md hover:shadow-lg text-white px-5 py-2 rounded-md flex items-center gap-3 w-full md:w-auto justify-center">
            <User class="size-5" />
            <span>More about me</span>
        </a>
    {/snippet}
</Hero>
{@render children?.()}
<Contact/>