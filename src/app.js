const express = require("express");

// const fs = require("fs");
const cors = require("cors");

const bodyParser = require("body-parser");
const { router } = require("./routes");
const { connectDB } = require("./db");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const PORT = 5001; // api port

connectDB();

app.use(router);

app.listen(PORT, () => {
  console.log("App is running on port " + PORT);
});
