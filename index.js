const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("server is running well");
});

app.listen(port, () => {
  console.log(`mongodb db server is running, ${port}`);
});
