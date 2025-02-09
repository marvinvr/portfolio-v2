<script lang="ts">
  import { Twitter, Linkedin, Github, Mail, Phone } from "lucide-svelte";


  const socials: { icon: any; link: string }[] = [
    {
      icon: Twitter,
      link: "https://twitter.com/marvinvr",
    },
    {
      icon: Linkedin,
      link: "https://www.linkedin.com/in/marvinvr",
    },
    {
      icon: Github,
      link: "https://github.com/marvinvr",
    },
    {
      icon: Mail,
      link: "mailto:hello@marvinvr.ch",
    },
    {
      icon: Phone,
      link: "tel:+41774488352",
    },
  ];
</script>

<div class="space-x-2">
  {#each socials as social}
    <a
      class="inline-flex justify-center items-center w-9 h-9 text-sm font-semibold rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none transition"
      href={social.link}
      target="_blank"
    >
      <svelte:component this={social.icon} class="size-5" alt="Social Icon" />
    </a>
  {/each}
</div>
