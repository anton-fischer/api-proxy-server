# api-proxy-server

Simple API-proxy server used to forward any request to an API with rate limiting and caching, running as a Cloudflare Worker built with [Hono](https://hono.dev).

This project is based on [this](https://www.youtube.com/watch?v=ZGymN8aFsv4) YouTube tutorial.

### Setup

1. Install dependencies: `npm install`.

2. Log in to Cloudflare: `npx wrangler login`.

3. Create the two KV namespaces used for caching and rate limiting:
   ```
   npx wrangler kv namespace create CACHE_KV
   npx wrangler kv namespace create RATE_LIMIT_KV
   npx wrangler kv namespace create CACHE_KV --env dev
   npx wrangler kv namespace create RATE_LIMIT_KV --env dev
   ```
   Copy the generated `id` values into the matching `[[kv_namespaces]]` entries in `wrangler.toml`.

4. Create a `.dev.vars` file based on `.dev.vars.example` and fill in all values. This file is used for local development only and is never deployed.

### Usage

- Run `npm run dev` to start the worker locally with Wrangler. Per default, it will be hosted on `http://localhost:8787`.

- Send a GET request, e.g. `http://localhost:8787/api?steamid=76561198952409015&include_appinfo=0`.

- Run `npm run deploy` to deploy the worker to Cloudflare. Configure production secrets with `npx wrangler secret put <NAME>` or the Cloudflare dashboard.
