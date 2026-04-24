<script lang="ts">
  import {
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
  <div class="max-w-screen-xl mx-auto px-4 md:px-8">
    <h2 class="text-gray-800 text-xl font-semibold mb-2">Contact me</h2>
    <p class="text-gray-600 max-w-2xl mb-6">
      I'd love to talk! Feel free to reach out via any of the following channels:
    </p>
    <div class="flex flex-wrap gap-3">
      {#each contactMethods as item (item.title)}
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all text-gray-700 hover:text-gray-900"
        >
          <item.icon class="size-4" />
          <span class="text-sm font-medium">{item.title}</span>
        </a>
      {/each}
    </div>
  </div>
</section>
