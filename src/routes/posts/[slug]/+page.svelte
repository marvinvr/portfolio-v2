<script lang="ts">
  import { formatDate } from "$lib/utils/date";
  import type { PageData } from "./$types";

  // @ts-ignore
  import portrait from "$lib/assets/portrait.jpeg?format=webp&w=200&h=200";
  import { onMount } from "svelte";
  import { image } from "$lib/utils/images";

  let mounted = false;

  onMount(() => {
    mounted = true;
  });

  export let data: PageData;
  const { content, meta, slug } = data;
</script>

<svelte:head>
  <title>{data.meta.title} | Marvin von Rappard</title>
  <meta property="og:type" content="article" />
  <meta property="og:title" content={meta.title} />
  <meta property="og:description" content={meta.description} />

  <meta property="twitter:title" content={meta.title} />
  <meta property="twitter:description" content={meta.description} />
</svelte:head>

<main class="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white antialiased">
  <div class="flex justify-between px-4 mx-auto max-w-screen-xl">
    <article
      class="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue"
    >
      <a href="/" class="flex items-center justify-start mb-8 text-indigo-900">
        <svg
          class="w-6 h-6 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2.5"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          /></svg
        >
        <span>Go back to Home</span>
      </a>
      <header class="mb-4 lg:mb-6 not-format">
        <img
          class="mb-6 w-full h-64 object-cover rounded-lg"
          src={image(slug, meta.header)}
          alt={meta.title}
        />
        <h1
          class="mb-4 font-extrabold leading-tight text-gray-900 lg:mb-6"
        >
          {meta.title}
        </h1>
        <address class="flex items-center mb-6 not-italic">
          <div class="inline-flex items-center mr-3 text-sm text-gray-900">
            <img
              class="mr-4 w-14 h-14 rounded-full"
              src={portrait}
              alt="Marvin von Rappard"
            />
            <div>
              <a href="/" rel="author" class="text-lg font-bold text-gray-900"
                >Marvin von Rappard</a
              >
              <span class="text-gray-500 text-md block">
                Data Scientist & Bachelors of Science Student
              </span>
              <p class="text-gray-500 text-sm">
                Published on {formatDate(meta.date)}
              </p>
            </div>
          </div>
        </address>
      </header>
      <div class="prose prose-lg mb-12">
        <svelte:component this={content} />
      </div>
      {#if mounted}
        <script
          src="https://giscus.app/client.js"
          data-repo="marvinvr/comments"
          data-repo-id="R_kgDOJZGi4g"
          data-category="Announcements"
          data-category-id="DIC_kwDOJZGi4s4Ca4ci"
          data-mapping="pathname"
          data-strict="0"
          data-reactions-enabled="1"
          data-emit-metadata="0"
          data-input-position="bottom"
          data-theme="light"
          data-lang="en"
          data-loading="lazy"
          crossorigin="anonymous"
          async
        ></script>
      {/if}
    </article>
  </div>
</main>

<hr class="my-6 border-gray-200 sm:mx-auto lg:my-8" />
