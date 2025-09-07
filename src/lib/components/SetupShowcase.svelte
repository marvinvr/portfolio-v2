<script lang="ts">
  import { useLazyImage as lazyImage } from "svelte-lazy-image";
  import { ExternalLink } from "lucide-svelte";

  interface SetupItem {
    name: string;
    detail?: string;
    link?: string;
  }

  interface Props {
    image: string;
    imageAlt?: string;
    title: string;
    subtitle?: string;
    setupTitle?: string;
    items?: SetupItem[];
    reverse?: boolean; // optional: place image on right
  }

  let {
    image,
    imageAlt = "Showcase image",
    title,
    subtitle = "",
    setupTitle = "My Setup",
    items = [],
    reverse = false,
  }: Props = $props();
</script>

<section class="py-16">
  <div class="max-w-screen-xl mx-auto px-4 md:px-8">
    <div
      class={`flex items-start gap-8 lg:gap-12 flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"}`}
    >
      <!-- Image -->
      <div class="flex-1 w-full">
        <img
          use:lazyImage
          data-src={image}
          alt={imageAlt}
          class="w-full h-auto rounded-lg shadow-lg object-cover"
        />
      </div>

      <!-- Text content -->
      <div class="flex-1 w-full">
        <h2 class="text-gray-800 mb-2">{title}</h2>
        {#if subtitle}
          <p class="text-gray-600 mb-6">{subtitle}</p>
        {/if}

        <div class="mt-2">
          <h3 class="text-gray-800 text-lg font-semibold mb-3">{setupTitle}</h3>

          {#if items.length === 0}
            <p class="text-gray-500 text-sm">No items yet.</p>
          {:else}
            <ul class="space-y-4">
              {#each items as item (item.name)}
                <li class="flex items-start gap-3">
                  <div class="mt-2 h-2 w-2 rounded-full bg-gray-300 shrink-0"></div>
                  <div>
                    <div class="flex items-center gap-2 text-gray-800 font-medium">
                      <span>{item.name}</span>
                      {#if item.link}
                        <a
                          class="inline-flex items-center text-indigo-600 hover:text-indigo-700"
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open link for ${item.name}`}
                        >
                          <ExternalLink class="size-4" />
                        </a>
                      {/if}
                    </div>
                    {#if item.detail}
                      <div class="text-gray-600 text-sm">{item.detail}</div>
                    {/if}
                  </div>
                </li>
              {/each}
            </ul>
          {/if}
        </div>
      </div>
    </div>
  </div>
  
</section>
