<script lang="ts">
  import { Linkedin, Github, Mail, Phone } from "lucide-svelte";
  import { getEmailUrl } from "$lib/utils/email";
  import SectionHeader from "./SectionHeader.svelte";

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
      title: "Phone",
      icon: Phone,
      link: "tel:+41774488352",
    },
  ];
</script>

<section class="py-24">
  <div class="max-w-screen-xl mx-auto px-4 md:px-8">
    <SectionHeader {title} description={subtitle} />
    {#if description}
      <p class="text-gray-600 text-sm max-w-2xl mt-2 leading-relaxed">
        {description}
      </p>
    {/if}
    <div class="flex flex-wrap gap-3 mt-6">
      {#each contactMethods as item (item.title)}
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-sm hover:border-gray-300 hover:bg-gray-50 transition-colors text-gray-700 hover:text-gray-900 text-sm"
        >
          <item.icon class="size-4" />
          <span>{item.title}</span>
        </a>
      {/each}
    </div>
  </div>
</section>
