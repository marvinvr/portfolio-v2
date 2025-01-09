<script lang="ts">
    import Hero from "$lib/components/Hero.svelte";
    import Contact from "$lib/components/Contact.svelte";
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
    subtitle="This is where you can find my most recent blog posts. Usually in the domain of Artificial Intelligence. Use any of the links below to get in touch!"/>
<slot/>
<Contact/>