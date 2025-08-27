<script lang="ts">
  import GraphOutline from "svelte-material-icons/GraphOutline.svelte";
  import Translate from "svelte-material-icons/Translate.svelte";
  import CodeBraces from "svelte-material-icons/CodeBraces.svelte";
  import HeadCogOutline from "svelte-material-icons/HeadCogOutline.svelte";
  import Web from "svelte-material-icons/Web.svelte";
  import Database from "svelte-material-icons/Database.svelte";

  const skills: { title: string; desc: string; icon: any }[] = [
    {
      title: "Software Engineering",
      desc: "Backend development with <b>Java</b>, <b>TypeScript</b> and <b>Golang</b>. <b>Python</b> for data analysis and machine learning. Focus on scalable architecture and clean code.",
      icon: CodeBraces,
    },
    {
      title: "Database Technologies",
      desc: "<b>SQL</b>, <b>MongoDB</b>, and <b>GraphQL</b> for data storage and retrieval. Design of efficient database schemas and queries.",
      icon: Database,
    },
    {
      title: "Frontend Web Development",
      desc: "Web applications with <b>Angular</b>, <b>React</b> and <b>SvelteKit</b>. Component-based architecture and responsive design.",
      icon: Web,
    },
    {
      title: "Deep Learning",
      desc: "Neural network development with <b>PyTorch</b>. Experiment tracking and optimization using <b>Weights & Biases</b>.",
      icon: GraphOutline,
    },
    {
      title: "Natural Language Processing",
      desc: "Text processing and analysis using transformer models. Implementation of <b>LLMs</b> and <b>RAG</b> systems.",
      icon: Translate,
    },
    {
      title: "Prompt Engineering",
      desc: "<b>LLM</b> prompt design and optimization. System prompts for complex AI applications.",
      icon: HeadCogOutline,
    },
  ];
</script>

<section class="py-24" id="skills">
  <div class="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
    <div class="relative max-w-2xl">
      <div class="relative z-10">
        <h2 class="text-gray-800">My Skills</h2>
        <p class="mt-3">
          I build end-to-end software solutions, from backend systems to user interfaces. My technical toolkit includes <b>full-stack development</b>, <b>data engineering</b>, and <b>machine learning</b>, which I've applied across manufacturing, compliance, and education sectors.
        </p>
      </div>
    </div>
    <div class="relative mt-12">
      <ul class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {#each skills as item}
          <li class="bg-white space-y-3 p-4 border rounded-lg">
            <div class="text-indigo-600 pb-3">
              <item.icon class="w-6 h-6" />
            </div>
            <span class="text-lg text-gray-800 font-semibold">
              {item.title}
            </span>
            <p>
              {@html item.desc}
            </p>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</section>
