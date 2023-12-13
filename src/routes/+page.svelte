<script lang="ts">
  import Hero from "$lib/components/Hero.svelte";
  import Timeline from "$lib/components/Timeline.svelte";

  // @ts-ignore
  import apiaxLogo from "$lib/assets/logo_apiax.png?format=webp&w=100&h=100";
  // @ts-ignore
  import fhnwLogo from "$lib/assets/logo_fhnw.webp?format=webp&w=100&h=100";
  // @ts-ignore
  import kantiLogo from "$lib/assets/logo_kanti.jpeg?format=webp&w=100&h=100";

  import Skills from "$lib/components/Skills.svelte";
  import Contact from "$lib/components/Contact.svelte";
  import Posts from "$lib/components/Posts.svelte";

  import type { PageData } from "./$types";

  export let data: PageData;
  const { latestPosts } = data;
</script>

<svelte:head>
  <meta
    name="keywords"
    content="Marvin von Rappard, von Rappard, Switzerland, Baden, Data Scientist, Software Engineer, Deep Learning, Data, Science"
  />
  <link rel="canonical" href="https://marvinvr.ai" />
  <meta
    name="description"
    property="og:description"
    content="The personal portfolio of Marvin von Rappard. This is an overview of my recent posts and current projects i'm working on."
  />

  <meta property="og:url" content="https://marvinvr.ai" />
  <meta property="og:title" content="Marvin von Rappard | Portfolio" />
  <meta property="og:image" content="https://marvinvr.ai/og-image.png" />
  <meta property="og:type" content="website" />

  <meta name="twitter:title" content="Marvin von Rappard | Portfolio" />
  <meta
    name="twitter:description"
    content="The personal portfolio of Marvin von Rappard. This is an overview of my recent posts and current projects i'm working on."
  />
  <meta name="twitter:image" content="https://marvinvr.ai/og-image.png" />
</svelte:head>

<Hero
  subtitle="I'm currently working at Apiax as part of a team developing state-of-the-art compliance AI, harnessing the power of natural language processing and advanced technologies like LLMs. In addition, I'm studying Data Science at the University of Applied Sciences Northwestern Switzerland."
/>
<Timeline
  title="My Professional History"
  items={[
    {
      date: "Nov\xa02022 - Now",
      link: "https://www.apiax.com/",
      title: "AI Lab at Apiax",
      position: "Data Scientist",
      description:
        "As part of our AI Lab team, I am currently working on understanding, processing and eventually digitizing Legal Documents using state-of-the-art Natural Language Processing technologies.",
      icon: apiaxLogo,
    },
    {
      date: "Aug\xa02020 - Nov\xa02022",
      link: "https://www.apiax.com/",
      title: "Product Team at Apiax",
      position: "Software Engineer",
      description:
        "After having already conducted a one year Internship at Apiax and having switched over to a full time employment I joined the Product Team which is responsible for simplifying digital compliance by building state of the art software in the form of web applications. In addition to that I had some first leadership experiences by managing smaller projects at the company and leading multiple EFZ candidates through their final exams.",
      icon: apiaxLogo,
    },
    {
      date: "Aug\xa02019 - Jul\xa02020",
      link: "https://www.apiax.com/",
      title: "Operations Team at Apiax",
      position: "Software Engineer - Internship",
      description:
        "During my Internship at Apiax I took part in shaping the IT infrastructure of a fast growing startup whilst making my first experiences working as a Software Engineer.",
      icon: apiaxLogo,
    },
  ]}
/>
<Skills />
<Timeline
  title="My Education"
  items={[
    {
      date: "Sep\xa02021 - Sep\xa02024",
      link: "https://www.fhnw.ch/de/studium/technik/data-science",
      position: "Bachelor of Science in Data Science",
      title: "University of Applied Sciences and Arts Northwestern Switzerland",
      description:
        "I am currently one year away from completing my studies at University of Applied Sciences and working on my bachelor's degree in Data Science. The degree focuses on data analysis and machine learning, while enabling me to learn about the mathematical background behind these algorithms.",
      icon: fhnwLogo,
    },
    {
      date: "Aug\xa02016 - Jul\xa02020",
      link: "https://www.kanti-baden.ch/informatikmittelschule/",
      position: "Student at Informatics Middle School",
      title: "Kanti Baden",
      description:
        "At Kantonsschule Baden I studied in “Informatikmittelschule” which was my first touchpoint with IT. I learned programming primarily in Java and was introduced to various technologies whilst doing my Berufsmatura (BM) in economics.",
      icon: kantiLogo,
    },
  ]}
/>
<Posts
  title="My Latest Posts"
  description="My posts usually center around some Deep Learning project I've been working on. These are my most recent ones:"
  posts={latestPosts}
/>
<Contact />
