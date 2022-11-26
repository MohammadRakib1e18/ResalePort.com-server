const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

require("dotenv").config();

app.use(cors());
app.use(express.json());

const categories = require('./data/categories');

app.get("/categories", async (req, res) => {
  res.send(categories);
});

app.listen(port, () => {
  console.log(`mongodb db server is running, ${port}`);
});
