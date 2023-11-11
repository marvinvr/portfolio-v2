<script>
  import Socials from "./Socials.svelte";

</script>
<footer class="w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto">
    <!-- Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 items-center gap-5 text-center">
      <div class="text-center md:text-left">
        <span class="flex-none text-md text-gray-600 dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">&copy; {new Date().getFullYear()} - Marvin von Rappard</span>
      </div>
      <!-- End Col -->
  
      <ul class="text-center">
        <li class="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300 dark:before:text-gray-600">
          <a class="inline-flex gap-x-2 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href="/">
            About
          </a>
        </li>
        <li class="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300 dark:before:text-gray-600">
          <a class="inline-flex gap-x-2 text-sm text-gray-500 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-200 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href="/blog">
            Blog
          </a>
        </li>
      </ul>
      <!-- End Col -->
  
      <!-- Social Brands -->
      <div class="md:text-end space-x-2">
        <Socials />
      </div>
      <!-- End Social Brands -->
    </div>
    <!-- End Grid -->
  </footer>