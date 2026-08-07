const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();


// use port declared in env, else use 5000
const PORT = process.env.PORT || 5000;

const app = express();

// rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // 100 requests
});
app.use(limiter);
app.set("trust proxy", 1);

// include routes
app.use("/api", require("./routes/routes"))

// enable cors
app.use(cors());

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));