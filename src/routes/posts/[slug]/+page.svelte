<script lang="ts">
  import { formatDate } from '$lib/utils/date';
  import type { PageData } from './$types';

  // @ts-ignore
  import portrait from "$lib/assets/portrait.jpeg?format=webp&w=200&h=200";
  
  
  export let data: PageData
</script>

<svelte:head>
	<title>{data.meta.title} | Marvin von Rappard</title>
	<meta property="og:type" content="article" />
    <meta property="og:title" content={data.meta.title} />
    <meta property="og:description" content={data.meta.description} />

    <meta property="twitter:title" content={data.meta.title} />
    <meta property="twitter:description" content={data.meta.description} />
</svelte:head>

<main class="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white antialiased">
    <div class="flex justify-between px-4 mx-auto max-w-screen-xl ">
        <article class="mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue">
            <a href="/" class="flex items-center justify-start mb-8 text-indigo-900">
                <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                <span>Go back to Home</span>
            </a>
            <header class="mb-4 lg:mb-6 not-format">
                <address class="flex items-center mb-6 not-italic">
                    <div class="inline-flex items-center mr-3 text-sm text-gray-900">
                        <img class="mr-4 w-16 h-16 rounded-full" src={portrait} alt="Marvin von Rappard">
                        <div>
                            <a href="/" rel="author" class="text-xl font-bold text-gray-900">Marvin von Rappard</a>
                            <p class="text-base text-gray-500">Data Scientist & Bachelors of Science Student</p>
                            <p class="text-base text-gray-500">Published on {formatDate(data.meta.date)}</p>
                        </div>
                    </div>
                </address>
                <h1 class="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl">{data.meta.title}</h1>
            </header>
            <div class="prose prose-lg">
                <svelte:component this={data.content} />
            </div>
        </article>
    </div>
  </main>
  

  <hr class="my-6 border-gray-200 sm:mx-auto lg:my-8">

