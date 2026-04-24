<script>
    import Socials from "./Socials.svelte";
</script>

<footer class="w-full py-10">
    <div class="max-w-[88rem] mx-auto px-4 md:px-8">
        <div class="border-t border-gray-200"></div>
    </div>

    <!-- Grid -->
    <div class="max-w-screen-xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 items-center gap-5 text-center mt-8">
        <div class="text-center md:text-left">
            <span class="flex-none text-sm text-gray-500">
                &copy; {new Date().getFullYear()} — Marvin von Rappard
            </span>
        </div>
        <!-- End Col -->

        <ul class="text-center">
            <li
                class="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300"
            >
                <a
                    class="inline-flex gap-x-2 text-sm text-gray-500 hover:text-gray-800 transition"
                    href="/"
                >
                    about
                </a>
            </li>
            <li
                class="inline-block relative pe-8 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-3 before:-translate-y-1/2 before:content-['/'] before:text-gray-300"
            >
                <a
                    class="inline-flex gap-x-2 text-sm text-gray-500 hover:text-gray-800 transition"
                    href="/blog"
                >
                    blog
                </a>
            </li>
        </ul>
        <!-- End Col -->

        <!-- Social Brands -->
        <div class="md:text-end space-x-2">
            <Socials align="end" />
        </div>
        <!-- End Social Brands -->
    </div>
    <!-- End Grid -->
</footer>
