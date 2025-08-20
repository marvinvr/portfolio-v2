<script lang="ts">
  import {
    Twitter,
    Linkedin,
    Github,
    Mail,
    Phone,
    ArrowRight,
  } from "lucide-svelte";
  import { getEmailUrl } from "$lib/utils/email";
  const contactMethods: {
    title: string;
    icon: any;
    label: string;
    link: string;
  }[] = [
    {
      title: "X / Twitter",
      label: "Follow me on X",
      icon: Twitter,
      link: "https://twitter.com/marvinvr",
    },
    {
      title: "LinkedIn",
      label: "Let's connect on LinkedIn",
      icon: Linkedin,
      link: "https://www.linkedin.com/in/marvinvr/",
    },
    {
      title: "GitHub",
      label: "Check out my GitHub",
      icon: Github,
      link: "https://github.com/marvinvr",
    },
    {
      title: "Email",
      label: "Send me an Email",
      icon: Mail,
      link: getEmailUrl(),
    },
    {
      title: "Phone",
      label: "Give me a call",
      icon: Phone,
      link: "tel:+41774488352",
    },
  ];
</script>

<section class="py-14">
  <div
    class="max-w-screen-xl mx-auto px-4 text-gray-600 gap-12 md:px-8 lg:flex flex-col"
  >
    <div class="">
      <h2 class="text-gray-800">Contact me</h2>
      <p class="mt-3 text-gray-600 max-w-2xl">
        I'd love to talk! Feel free to reach out via any of the following channels:
      </p>
    </div>
    <div>
      <div
        class="mb-8 mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
      >
        {#each contactMethods as item (item.title)}
          <button
            type="button"
            on:click={() => window.open(item.link, "_blank")}
            class="space-y-3 px-2 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer text-left w-full"
          >
            <div
              class="w-12 h-12 rounded-full border flex items-center justify-center text-gray-700"
            >
              <svelte:component
                this={item.icon}
                class="size-5"
                alt="Social Icon"
              />
            </div>
            <h4 class="text-gray-800 text-lg font-medium xl:text-xl">
              {item.title}
            </h4>
            <a
              href={item.link}
              class="text-blue-600 hover:text-blue-500 inline-flex items-center gap-1"
            >
              {item.label}
              <ArrowRight class="size-4" />
            </a>
          </button>
        {/each}
      </div>
    </div>
  </div>
</section>
