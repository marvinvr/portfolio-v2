<script lang="ts">
  import GraphOutline from "svelte-material-icons/GraphOutline.svelte";
  import Translate from "svelte-material-icons/Translate.svelte";
  import CodeBraces from "svelte-material-icons/CodeBraces.svelte";
  import HeadCogOutline from "svelte-material-icons/HeadCogOutline.svelte";
  import Web from "svelte-material-icons/Web.svelte";
  import Database from "svelte-material-icons/Database.svelte";


  const skills: {title: string, desc: string, icon: any }[] = [
    {
      title: "Deep Learning",
      desc: "Specialized in PyTorch for building and training neural networks. Proficient with Weights & Biases for experiment tracking and model optimization.",
      icon: GraphOutline,
    },
    {
      title: "Natural Language Processing",
      desc: "Skilled in applying NLP techniques to derive meaningful insights from textual data, leveraging my experience with state-of-the-art compliance AI.",
      icon: Translate,
    },
    {
      title: "Prompt Engineering",
      desc: "Innovative in crafting and refining prompts for AI models, specializing in eliciting desired responses and fine-tuning interactions to optimize user experience and model performance.",
      icon: HeadCogOutline,
    },
    {
      title: "Software Engineering Expertise",
      desc: "Versatile software engineer proficient in backend development with Java and TypeScript, coupled with strong Python programming skills for data analysis, machine learning, and algorithm development using tools like Jupyter.",
      icon: CodeBraces,
    },
    {
      title: "Database Technologies",
      desc: "Experienced with SQL, MongoDB, and GraphQL, emphasizing efficient data storage, retrieval, and manipulation.",
      icon: Database,
    },
    {
      title: "Frontend Web Development",
      desc: "Skilled in creating user-friendly web applications using Angular and SvelteKit, focusing on responsive design and user experience.",
      icon: Web,
    },
  ];
</script>

<section class="py-24" id="skills">
  <div class="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
    <div class="relative max-w-2xl">
      <div class="relative z-10">
        <h3 class="text-gray-800 text-3xl font-semibold sm:text-4xl">
          My Skills
        </h3>
        <p class="mt-3">
          I am a versatile data scientist and software engineer with a strong background in machine learning and natural language processing. I am passionate about leveraging AI to solve real-world problems and create value for businesses and society.
        </p>
      </div>
    </div>
    <div class="relative mt-12">
      <ul class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {#each skills as item}
          <li class="bg-white space-y-3 p-4 border rounded-lg">
            <div class="text-indigo-600 pb-3">
              <svelte:component
                this={item.icon}
                class="w-6 h-6"
              />
            </div>
            <h4 class="text-lg text-gray-800 font-semibold">
              {item.title}
            </h4>
            <p>
              {item.desc}
            </p>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</section>
