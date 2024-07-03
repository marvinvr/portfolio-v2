import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';


export default defineConfig({
	plugins: [sentrySvelteKit({
        sourceMapsUploadOptions: {
            org: "mvr",
            project: "portfolio-v2",
            url: "https://logs.mvr.bz/"
        }
    }), sveltekit(), imagetools()]
});