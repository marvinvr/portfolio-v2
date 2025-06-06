import { sequence } from "@sveltejs/kit/hooks";
import { handleErrorWithSentry, sentryHandle } from "@sentry/sveltekit";
import * as Sentry from "@sentry/sveltekit";
import { PUBLIC_ENVIRONMENT } from "$env/static/public";

Sentry.init({
  dsn: "https://bda08cd0d8241c342a9893229c28c7c9@o4508799303548928.ingest.de.sentry.io/4509140369866832",
  tracesSampleRate: 1.0,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: import.meta.env.DEV,

  environment: PUBLIC_ENVIRONMENT,
	enabled: PUBLIC_ENVIRONMENT !== 'local'
});

// If you have custom handlers, make sure to place them after `sentryHandle()` in the `sequence` function.
export const handle = sequence(sentryHandle());

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
