<script lang="ts">
  import { Twitter, Linkedin, Github, Mail, Phone } from "lucide-svelte";
  import { getEmailUrl } from "$lib/utils/email";

  interface Props {
    title: string;
    subtitle: string;
    description: string;
  }

  let {
    title,
    subtitle,
    description
  }: Props = $props();

  const contactMethods: {
    title: string;
    icon: any;
    link: string;
  }[] = [
    {
      title: "Email",
      icon: Mail,
      link: getEmailUrl(),
    },
    {
      title: "LinkedIn",
      icon: Linkedin,
      link: "https://www.linkedin.com/in/marvinvr/",
    },
    {
      title: "GitHub",
      icon: Github,
      link: "https://github.com/marvinvr",
    },
    {
      title: "X / Twitter",
      icon: Twitter,
      link: "https://twitter.com/marvinvr",
    },
    {
      title: "Phone",
      icon: Phone,
      link: "tel:+41774488352",
    },
  ];
</script>

<section class="pt-12 pb-24">
  <div class="max-w-screen-xl mx-auto px-4 md:px-8 text-center">
    <div class="space-y-4">
      <h2 class="text-gray-900 font-bold text-3xl xl:text-4xl">
        {title}
      </h2>
      <p class="text-gray-600 text-lg max-w-2xl mx-auto">
        {subtitle}
      </p>
      <p class="text-gray-700 max-w-3xl mx-auto leading-relaxed">
        {description}
      </p>
      <div class="flex flex-wrap justify-center gap-3 pt-2">
        {#each contactMethods as item (item.title)}
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all text-gray-700 hover:text-gray-900"
          >
            <item.icon class="size-5" />
            <span class="font-medium">{item.title}</span>
          </a>
        {/each}
      </div>
    </div>
  </div>
</section>