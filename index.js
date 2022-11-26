const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

require("dotenv").config();

app.use(cors());
app.use(express.json());

const categories = require('./data/categories.json');
const products = require('./data/products.json')

app.get("/categories", (req, res) => {
  console.log('hello rakib');
  res.send(categories);
});

app.get("/category/:id", (req, res)=>{
  const id = req.params.id;
  console.log("rakib");
  const product = products.filter(prd => prd.sub_category==id);
  res.send(product);
})

app.listen(port, () => {
  console.log(`mongodb db server is running, ${port}`);
});
