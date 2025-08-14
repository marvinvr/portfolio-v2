<script lang="ts">
  import Hero from "$lib/components/Hero.svelte";
  import Timeline from "$lib/components/Timeline.svelte";

  // @ts-ignore
  import apiaxLogo from "$lib/assets/logo_apiax.png?format=webp&w=100&h=100";
  // @ts-ignore
  import fhnwLogo from "$lib/assets/logo_fhnw.webp?format=webp&w=100&h=100";
  // @ts-ignore
  import kantiLogo from "$lib/assets/logo_kanti.jpeg?format=webp&w=100&h=100";
  // @ts-ignore
  import octotronicLogo from "$lib/assets/logo_octotronic.jpeg?format=webp&w=100&h=100";

  // @ts-ignore
  import computerVisionChallengeHeader from "$lib/posts/2023-11-13-wildlife-cameras/header.png?format=webp&w=480";
  // @ts-ignore
  import autoYtShortsHeader from "$lib/projects/auto-yt-shorts.png?format=webp&w=560";
  // @ts-ignore
  import reportGptHeader from "$lib/projects/report-gpt.png?format=webp&w=560";
  // @ts-ignore
  import postPulseHeader from "$lib/projects/post-pulse.png?format=webp&w=560";
  // @ts-ignore
  import writeABookAIHeader from "$lib/projects/write-a-book-ai.png?format=webp&w=560";
  // @ts-ignore
  import modelOfOurGalaxyHeader from "$lib/projects/model-of-our-solar-system.png?format=webp&w=560";

  import Skills from "$lib/components/Skills.svelte";
  import Contact from "$lib/components/Contact.svelte";
  import Posts from "$lib/components/Posts.svelte";
  import YouTube from "$lib/components/YouTube.svelte";

  import type { PageData } from "./$types";
  import Projects from "$lib/components/Projects.svelte";

  export let data: PageData;
  const { latestPosts } = data;
</script>

<svelte:head>
  <meta
    name="keywords"
    content="Marvin von Rappard, von Rappard, Switzerland, Baden, Data Scientist, Software Engineer, Full Stack Engineer, Full Stack Developer, Deep Learning, Data Scientist, AI"
  />
  <link rel="canonical" href="https://marvinvr.ch" />
  <meta
    name="description"
    property="og:description"
    content="The personal portfolio of Marvin von Rappard. This is an overview of my recent posts and current projects i'm working on."
  />

  <meta property="og:url" content="https://marvinvr.ch" />
  <meta property="og:title" content="Marvin von Rappard | Portfolio" />
  <meta property="og:image" content="https://marvinvr.ch/og-image.png" />
  <meta property="og:type" content="website" />

  <meta name="twitter:title" content="Marvin von Rappard | Portfolio" />
  <meta
    name="twitter:description"
    content="The personal portfolio of Marvin von Rappard. This is an overview of my recent posts and current projects i'm working on."
  />
  <meta name="twitter:image" content="https://marvinvr.ch/og-image.png" />
</svelte:head>

<Hero
  greeting="Hey, I'm Marvin"
  tagline="Full-Stack Engineer / Data Scientist"
  location="Baden, Switzerland"
  subtitle="Full-Stack Engineer and Data Scientist building ML/Analytics solutions at Octotronic. Previously built AI compliance tools at Apiax and an AI tutoring system at FHNW. I run WriteABookAI and ReportGPT as side projects. B.Sc. in Data Science from FHNW."
/>
<Timeline
  title="My Professional History"
  items={[
    {
      date: "Jan\xa02025 - Present",
      link: "https://www.octotronic.com/",
      title: "Octotronic AG",
      position: "Full-Stack Engineer",
      description:
        "Building the ML/Analytics layer for OctoCore, a smart factory platform that connects operational technology with IT systems. Working on data pipelines, analytics dashboards, and automation features for manufacturing operations.",
      icon: octotronicLogo,
    },
    {
      date: "Feb\xa02024 - Jan\xa02025",
      link: "https://www.fhnw.ch/de/die-fhnw/hochschulen/ht/institute/institut-fuer-data-science",
      title: "Institute for Data Science at FHNW",
      position: "Research Scientist",
      description:
        "Built an AI tutoring system for Bachelor students using LLMs and RAG technology. Developed the entire platform from architecture to deployment, serving multiple academic disciplines with personalized learning support.",
      icon: fhnwLogo,
    },
    {
      date: "Nov\xa02022 - Jan\xa02024",
      link: "https://www.apiax.com/",
      title: "AI Lab at Apiax",
      position: "Data Scientist",
      description:
        "Developed document processing systems using LLMs and RAG for regulatory compliance automation. Built tools that parse, analyze, and verify compliance documents, reducing manual review time by 70%.",
      icon: apiaxLogo,
    },
    {
      date: "Aug\xa02019 - Oct\xa02022",
      link: "https://www.apiax.com/",
      title: "Product Team at Apiax",
      position: "Full Stack Engineer",
      description:
        "Built progressive web apps for enterprise compliance management. Set up scalable infrastructure during company growth from 20 to 100+ employees. Mentored apprentices and led technical projects across frontend and backend systems.",
      icon: apiaxLogo,
    },
  ]}
/>
<Projects
  title="My Latest Projects"
  description="I'm currently working on a few projects in my free time. Here are some of my latest ones:"
  projects={[
    {
      title: "WriteABookAI",
      image: writeABookAIHeader,
      description:
        "WriteABookAI is an AI-native book writing tool that helps You bring your Book to Life. It's powered by Large Language Models among other AI technologies.",
      url: "https://WriteABookAI.com",
      release: "2025-06-01",
    },
    {
      title: "Model of our Solar System",
      image: modelOfOurGalaxyHeader,
      description:
        "This is a small model of our Solar System running entirely in your Browser and accurately depicting the positions of Planets at specific dates",
      url: "/model-of-the-solar-system.html",
      release: "2025-07-10",
    },
    {
      title: "ReportGPT",
      image: reportGptHeader,
      description:
        "ReportGPT is a web-based tool that helps you write reports and other documents faster and more efficiently with the help of Large Language Models.",
      url: "https://ReportGPT.app",
      release: "2023-11-01",
    },
    {
      title: "Auto-yt-shorts",
      image: autoYtShortsHeader,
      description:
        "Auto-yt-shorts is an open-source project designed to automate the process of generating engaging short videos for platforms like YouTube and TikTok.",
      url: "https://github.com/marvinvr/auto-yt-shorts",
      release: "2023-10-15",
    },
    {
      title: "PostPulse",
      image: postPulseHeader,
      description:
        "PostPulse is a service designed specifically for SaaS founders. Each month, we publish high-quality, AI-crafted posts about your Startup on premium, SEO-optimized domains.",
      url: "https://PostPulseAI.com",
      release: "2024-06-01",
    },
    {
      title: "Conser-vision Practice Area: Image Classification",
      image: computerVisionChallengeHeader,
      description:
        "I recently participated in a computer vision challenge where I had to classify images of wildlife cameras. Our findings are available on GitHub.",
      url: "https://github.com/marvinvr/ccv1",
      release: "2023-07-01",
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
      title: "FHNW - University of Applied Sciences Northwestern Switzerland",
      description:
        "Part-time degree covering statistics, machine learning, deep learning, and software engineering. Thesis on [specific topic if you want to add]. Completed while working full-time in industry.",
      icon: fhnwLogo,
    },
    {
      date: "Aug\xa02016 - Jul\xa02020",
      link: "https://www.kanti-baden.ch/informatikmittelschule/",
      position: "Student at Informatics Middle School",
      title: "Kanti Baden",
      description:
        "Four-year program combining software development (Java, web technologies) with business fundamentals. Included one-year internship at Apiax. Graduated with Berufsmatura in economics.",
      icon: kantiLogo,
    },
  ]}
/>
<Posts
  title="My Latest Posts"
  description="My posts usually center around some Deep Learning project I've been working on. These are my most recent ones:"
  posts={latestPosts}
/>
<YouTube
  title="My Latest Drone Videos"
  description="I shoot drone videos and upload them to YouTube when I travel to places. Check them out if you enjoy a nice scenery with from an aerial view."
/>
<Contact />
