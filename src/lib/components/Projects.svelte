<script lang="ts">
  import { formatDate } from "$lib/utils/date";
  import { useLazyImage as lazyImage } from "svelte-lazy-image";
  import SectionHeader from "./SectionHeader.svelte";

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

  const visibleProjects = $derived(projects.filter((p) => !p.hidden));
</script>

<section class="py-24">
  <div class="max-w-screen-xl mx-auto px-4 md:px-8">
    <SectionHeader {title} {description}>
      {@render children?.()}
    </SectionHeader>
    <ul
      class="grid gap-x-8 mt-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
      class:mt-12={description}
    >
      {#each visibleProjects as project (project.title)}
        <li
          class="w-full group sm:max-w-sm"
        >
          <a href={project.url} target="_blank">
            <img
              data-src={project.image}
              use:lazyImage
              alt={project.title}
              class="w-full rounded-md aspect-[1200/630] object-cover border border-gray-200"
            />
            <div class="mt-3 space-y-2">
              <div>
                <span class="font-mono text-xs text-gray-500">
                  {formatDate(project.release)}
                </span>
              </div>
              <span class="block text-lg text-gray-800 duration-150 font-semibold">
                {project.title}
              </span>
              {#if project.tags && project.tags.length > 0}
                <div class="flex flex-wrap gap-1.5">
                  {#each project.tags as tag}
                    <span class="px-2 py-0.5 text-xs text-gray-600 border border-gray-200 rounded-sm">
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
      {/each}
    </ul>
  </div>
</section>
