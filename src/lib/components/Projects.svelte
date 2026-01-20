<script lang="ts">
  import { formatDate } from "$lib/utils/date";
  import { useLazyImage as lazyImage } from "svelte-lazy-image";

  interface Props {
    title: string;
    description?: string;
    projects?: {
    title: string;
    hidden?: boolean;
    image: any;
    description: string;
    url: string;
    release: string;
    tags?: string[];
  }[];
    children?: import('svelte').Snippet;
  }

  let {
    title,
    description = "",
    projects = [],
    children
  }: Props = $props();
</script>

<section class="py-24">
  <div class="max-w-screen-xl mx-auto px-4 md:px-8">
    <div>
      <h2 class="text-gray-800 text-xl font-semibold mb-2">{title}</h2>
      {#if description}
        <p class="text-gray-600">{description}</p>
      {/if}
      {@render children?.()}
    </div>
    <ul
      class="grid gap-x-8 mt-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
      class:mt-12={description}
    >
      {#each projects as project (project.title)}
        {#if !project.hidden}
          <li
            class="w-full group sm:max-w-sm"
          >
            <a href={project.url} target="_blank">
              <img
                data-src={project.image}
                use:lazyImage
                alt={project.title}
                height="192"
                class="w-full rounded-md h-48 object-cover"
              />
              <div class="mt-3 space-y-2">
                <span class="block text-indigo-600 text-sm">
                  {formatDate(project.release)}
                </span>
                <span class="text-lg text-gray-800 duration-150 font-semibold">
                  {project.title}
                </span>
                {#if project.tags && project.tags.length > 0}
                  <div class="flex flex-wrap gap-1.5">
                    {#each project.tags as tag}
                      <span class="px-2 py-0.5 text-xs text-gray-600 border border-gray-200 rounded-full">
                        {tag}
                      </span>
                    {/each}
                  </div>
                {/if}
                <p
                  class="text-gray-600 text-sm duration-150 group-hover:text-gray-800"
                >
                  {project.description}
                </p>
              </div>
            </a>
            </li>
        {/if}
      {/each}
    </ul>
  </div>
</section>
