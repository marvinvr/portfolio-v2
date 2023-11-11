<script>
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
</script>

<Hero />
<Timeline title="My Professional History" items={[
  {
      date: "Now\xa02022 - Now",
      title: "AI Lab at Apiax",
      position: "Data Scientist",
      description: "As part of our AI Lab team, I am currently working on understanding, processing and eventually digitizing Legal Documents using state-of-the-art Natural Language Processing technologies.",
      icon: apiaxLogo
  },
  {
      date: "Aug\xa02020 - Nov\xa02022",
      title: "Product Team at Apiax",
      position: "Software Engineer",
      description: "After having already conducted a one year Internship at Apiax and having switched over to a full time employment I joined the Product Team which is responsible for simplifying digital compliance by building state of the art software in the form of web applications. In addition to that I had some first leadership experiences by managing smaller projects at the company and leading multiple EFZ candidates through their final exams.",
      icon: apiaxLogo
  },
  {
      date: "Aug\xa02019 - Jul\xa02020",
      title: "Operations Team at Apiax",
      position: "Internship - Software Engineer for internal tools",
      description: "During my Internship at Apiax I took part in shaping the IT infrastructure of a fast growing startup whilst making my first experiences working as a Software Engineer.",
      icon: apiaxLogo
  },
]} />
<Skills />
<Timeline title="My Education" items={[
  {
    date: "Sep\xa02021 - Sep\xa02024",
    position: "Bachelors of Science in Data Science",
    title: "University of Applied Sciences and Arts Northwestern Switzerland",
    description: "I am currently one year away from completing my studies at University of Applied Sciences and working on my bachelor's degree in Data Science. The degree focuses on data analysis and machine learning, while enabling me to learn about the mathematical background behind these algorithms.",
    icon: fhnwLogo
  },
  {
    date: "Aug\xa02016 - Jul\xa02020",
    position: "Student at Informatics Middle School",
    title: "Kanti Baden",
    description: "At Kantonsschule Baden I studied in “Informatikmittelschule” which was my first touchpoint with IT. I learned programming primarily in Java and was introduced to various technologies whilst doing my Berufsmatura (BM) in economics.",
    icon: kantiLogo
  }
]} />
<Contact />