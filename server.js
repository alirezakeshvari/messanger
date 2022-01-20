const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

const PORT = 8000 || process.env.PORT;

app.listen(PORT, () => console.log("Server is runnig on port " + PORT));
