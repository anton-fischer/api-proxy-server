const express = require("express");
const router = express.Router();
const needle = require("needle");
const apicache = require("apicache");

// include env vars
const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;
const API_KEY_VALUE = process.env.API_KEY_VALUE;

// initialize cache
let cache = apicache.middleware;

router.get("/", cache("10 minutes"), async (req, res) => {
    try {
        console.log("Received request with params:", req.query);

        const params = new URLSearchParams({
            [API_KEY_NAME]: API_KEY_VALUE,
            ...req.query,
        });

        const reqUrl = `${API_BASE_URL}?${params}`;
        console.log("Forwarding API-request:", reqUrl);

        const apiRes = await needle("get", reqUrl);
        const data = apiRes.body;

        //console.log("Sending API-response:", data);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    };
});

module.exports = router;