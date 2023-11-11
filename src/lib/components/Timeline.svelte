<script lang="ts">
    export let title: string
    export let items: {date: string, title: string, position: string, description: string, icon: any}[] = []

    // @ts-ignore
    import portrait from "$lib/assets/portrait.jpeg?format=webp&w=200&h=200";
</script>

<!-- Timeline -->
<div class="max-w-screen-xl mx-auto mt-12 px-4 md:px-8">
    
    <!-- Title -->
    <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-8">
        {title}
    </h2>
    <!-- Item -->
    {#each items as item}
        <div class="flex gap-x-3 rounded-lg">
        <div class="w-16 md:w-32 text-end">
            <div class="text-xs text-gray-500 dark:text-gray-400">{item.date}</div>
        </div>
        <!-- End Left Content -->
    
        <!-- Icon -->
        <div class="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-gray-700">
            <div class="relative z-10 w-7 h-7 flex justify-center items-center">
            <img class="flex-shrink-0 w-7 h-7 rounded-full" src={item.icon} alt={`${item.title} logo`}>
            </div>
        </div>
        <!-- End Icon -->
    
        <!-- Right Content -->
        <div class="pt-0.5 pb-8 w-11/12 md:w-9/12">
            <h3 class="flex gap-x-1.5 font-semibold text-gray-800 dark:text-white">
                {item.title}
            </h3>
            <span class="mt-1 -ms-1 p-1 inline-flex items-center gap-x-2 text-xs rounded-lg border border-transparent text-gray-500 disabled:opacity-50 disabled:pointer-events-none dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
            <img class="flex-shrink-0 w-4 h-4 rounded-full" src={portrait} alt="Portrait of Marvin von Rappard">
                {item.position}
            </span>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {item.description}
            </p>
        </div>
        <!-- End Right Content -->
        </div>
        <!-- End Item -->
    {/each}
  </div>
  <!-- End Timeline -->