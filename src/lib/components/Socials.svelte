<script lang="ts">
    import logoX from "$lib/assets/logo_x.svg";
    import logoLinkedin from "$lib/assets/logo_linkedin.svg";
    import logoEmail from "$lib/assets/logo_email.svg";

    const socials: { icon: any, link: string }[] = [
        {
            icon: logoX,
            link: "https://twitter.com/marvinvr",
        },
        {
            icon: logoLinkedin,
            link: "https://www.linkedin.com/in/marvinvr/",
        },
        {
            icon: logoEmail,
            link: "mailto:marvin@von-rappard.ch",
        }
    ];
</script>

<div class="mt-3 space-x-1">
    {#each socials as social}
        
    <a
        class="inline-flex justify-center items-center w-8 h-8 text-sm font-semibold rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none      "
        href={social.link}
        target="_blank"
    >
        <img src={social.icon}  class="flex-shrink-0 w-3.5 h-3.5" alt="Social Icon" />
    </a>

  {/each}
</div>
