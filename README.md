# MJ FX Hustle — Chart Study Web App

This is a mobile-friendly educational chart-reading website. It accepts up to five chart screenshots in one request and asks Gemini to describe visible chart concepts.

## Important scope and limitations
- This version is for chart-reading education only.
- It deliberately does **not** generate buy/sell decisions, entries, stop-losses, take-profits, risk/reward targets, or instructions to trade.
- Image interpretation can be wrong. It cannot read live market data from a screenshot.
- Symbol, timeframe, date/time, indicator values, and price levels are reported only when legible.
- Gemini's free API tier has limits and can change. Hosting may be free while AI requests are quota-limited.

## Project files
- `index.html` — mobile-friendly website.
- `functions/api/analyze.js` — Cloudflare Pages Function that securely calls Gemini.
- `wrangler.toml` — Pages project configuration.

## What you need
1. A GitHub account.
2. A Cloudflare account.
3. A Gemini API key from Google AI Studio. Check the current free-tier availability and terms before using it.
4. Do not share the API key with anyone or put it in `index.html`.

## Deploy for free with Cloudflare Pages
1. Create a GitHub repository and upload all files in this folder, preserving the `functions/api/analyze.js` path.
2. In Cloudflare, open **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select your repository.
4. For a plain HTML project, leave the build command empty and set the output directory to `/` (the repository root). If the dashboard requires a framework preset, choose **None**.
5. Deploy the site.
6. In the Pages project, open **Settings** → **Variables and Secrets**. Add a secret named `GEMINI_API_KEY` and paste your API key there.
7. Redeploy if Cloudflare asks you to. Open the `pages.dev` address and test with one screenshot first.

## Cost notes
- Cloudflare Pages static asset hosting has a free tier. Pages Functions use Workers quotas; the current free Workers allowance is limited (check the official limits page).
- Gemini API currently lists a free tier for some models, with usage limits and terms. Availability and limits may change. Google says content in the free tier may be used to improve its products, so do not upload private or sensitive screenshots.
- Do not add a payment method or upgrade just to test this starter. If the free quota is unavailable or exhausted, pause until it resets or use the app without AI calls.

## Official documentation
- Cloudflare Pages: https://pages.cloudflare.com/
- Pages limits: https://developers.cloudflare.com/pages/platform/limits/
- Workers limits: https://developers.cloudflare.com/workers/platform/limits/
- Gemini API pricing: https://ai.google.dev/gemini-api/docs/pricing
- Google AI Studio: https://aistudio.google.com/

## Local preview
You can open `index.html` to inspect the layout, but image analysis requires deploying the Pages Function and setting `GEMINI_API_KEY` as a server-side secret.
