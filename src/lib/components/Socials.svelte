<script lang="ts">
  import { Linkedin, Github, Mail, Phone } from "lucide-svelte";
  import { getEmailUrl } from "$lib/utils/email";

  interface Props {
    align?: "center" | "end";
  }

  let { align = "center" }: Props = $props();

  const socials: { icon: any; link: string }[] = [
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
      link: getEmailUrl(),
    },
    {
      icon: Phone,
      link: "tel:+41774488352",
    },
  ];
</script>

<div
  class="space-x-3 md:space-x-2 flex flex-row justify-center items-center"
  class:md:justify-end={align === "end"}
>
  {#each socials as social}
    <a
      class="inline-flex justify-center items-center w-9 h-9 text-sm font-semibold rounded-sm border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none transition"
      href={social.link}
      target="_blank"
    >
      <social.icon class="size-5" alt="Social Icon" />
    </a>
  {/each}
</div>
