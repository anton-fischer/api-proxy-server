const express = require("express");
const cors = require("cors");
require("dotenv").config();


// use port declared in env, else use 5000
const PORT = process.env.PORT || 5000;

const app = express();

// include routes
app.use("/api", require("./routes/routes"))

// enable cors
app.use(cors());

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));