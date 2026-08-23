import { Hono } from "hono";
import { cors } from "hono/cors";
import routes from "./routes/routes.js";

const RATE_LIMIT_WINDOW_SECONDS = 10 * 60; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 100;

const app = new Hono();

app.use("*", cors());

// rate limiting based on client IP, backed by KV
app.use("*", async (c, next) => {
    const ip = c.req.header("CF-Connecting-IP") || "unknown";
    const prefix = c.env.KV_PREFIX || "dev";
    const key = `${prefix}:ratelimit:${ip}`;

    const current = await c.env.RATE_LIMIT_KV.get(key);
    const count = current ? parseInt(current, 10) : 0;

    if (count >= RATE_LIMIT_MAX_REQUESTS) {
        return c.json({ error: "Too many requests, please try again later." }, 429);
    }

    await c.env.RATE_LIMIT_KV.put(key, String(count + 1), {
        expirationTtl: RATE_LIMIT_WINDOW_SECONDS,
    });

    await next();
});

app.route("/api", routes);

app.onError((error, c) => {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
});

export default app;