import { Hono } from "hono";

const CACHE_TTL_SECONDS = 10 * 60; // 10 minutes

const routes = new Hono();

routes.get("/", async (c) => {
    const { API_BASE_URL, API_KEY_NAME, API_KEY_VALUE, CACHE_KV, KV_PREFIX } = c.env;
    const query = c.req.query();

    console.log("Received request with params:", query);

    const params = new URLSearchParams({
        [API_KEY_NAME]: API_KEY_VALUE,
        ...query,
    });

    const cacheKey = `${KV_PREFIX || "dev"}:cache:${params}`;

    const cached = await CACHE_KV.get(cacheKey, "json");
    if (cached) {
        console.log("Serving response from cache:", cacheKey);
        return c.json(cached);
    }

    try {
        const reqUrl = `${API_BASE_URL}?${params}`;
        console.log("Forwarding API-request:", reqUrl);

        const apiRes = await fetch(reqUrl);
        const data = await apiRes.json();

        await CACHE_KV.put(cacheKey, JSON.stringify(data), {
            expirationTtl: CACHE_TTL_SECONDS,
        });

        return c.json(data);
    } catch (error) {
        console.error(error);
        return c.json({ error: "Failed to fetch data from upstream API" }, 500);
    }
});

export default routes;