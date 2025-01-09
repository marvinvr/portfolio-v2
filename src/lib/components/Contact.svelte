<script lang="ts">
  import logoX from "$lib/assets/logo_x.svg";
  import logoLinkedin from "$lib/assets/logo_linkedin.svg";
  import logoEmail from "$lib/assets/logo_email.svg";
  import logoGithub from "$lib/assets/logo_github.svg";

  const iconBlocks: {
    title: string;
    icon: any;
    label: string;
    link: string;
  }[] = [
    {
      title: "X / Twitter",
      label: "Follow me on X",
      icon: logoX,
      link: "https://twitter.com/marvinvr",
    },
    {
      title: "LinkedIn",
      label: "Connect on LinkedIn",
      icon: logoLinkedin,
      link: "https://www.linkedin.com/in/marvinvr/",
    },
    {
      title: "GitHub",
      label: "Check out my GitHub",
      icon: logoGithub,
      link: "https://github.com/marvinvr",
    },
    {
      title: "Email",
      label: "Send me an Email",
      icon: logoEmail,
      link: "mailto:hello@marvinvr.ch",
    },
  ];
</script>

<!-- Contact Us -->
<div
  class="max-w-screen-xl px-4 py-10 md:px-8 lg:px-8 lg:py-14 mx-auto"
  id="contact-me"
>
  <div>
    <div>
      <h2 class="text-gray-800">Contact me</h2>
      <p class="mt-1 text-gray-600">
        I'd love to talk! Feel free to reach out to me via any of the following
        channels:
      </p>
    </div>

    <div class="mt-12 lg:grid-cols-2 gap-6 lg:gap-16">
      <!-- End Card -->

      <div class="divide-y divide-gray-200 w-fit mx-auto">
        {#each iconBlocks as iconBlock}
          <!-- Icon Block -->
          <div class="flex gap-x-7 py-6 pr-12 w-full md:w-72">
            <img
              src={iconBlock.icon}
              class="flex-shrink-0 w-6 h-6 mt-1.5 text-gray-800"
              alt={iconBlock.title}
            />
            <div class="grow">
              <span class="font-semibold text-gray-800">{iconBlock.title}</span>
              <a
                class="mt-2 inline-flex items-center gap-x-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                href={iconBlock.link}
              >
                {iconBlock.label}
                <svg
                  class="flex-shrink-0 w-2.5 h-2.5 transition ease-in-out group-hover:translate-x-1"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.975821 6.92249C0.43689 6.92249 -3.50468e-07 7.34222 -3.27835e-07 7.85999C-3.05203e-07 8.37775 0.43689 8.79749 0.975821 8.79749L12.7694 8.79748L7.60447 13.7596C7.22339 14.1257 7.22339 14.7193 7.60447 15.0854C7.98555 15.4515 8.60341 15.4515 8.98449 15.0854L15.6427 8.68862C16.1191 8.23098 16.1191 7.48899 15.6427 7.03134L8.98449 0.634573C8.60341 0.268455 7.98555 0.268456 7.60447 0.634573C7.22339 1.00069 7.22339 1.59428 7.60447 1.9604L12.7694 6.92248L0.975821 6.92249Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          </div>
          <!-- End Icon Block -->
        {/each}
      </div>
    </div>
  </div>
</div>
<!-- End Contact Us -->
