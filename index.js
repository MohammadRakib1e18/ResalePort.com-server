const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

require("dotenv").config();

app.use(cors());
app.use(express.json());

const categories = require("./data/categories.json");
const products = require("./data/products.json");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ct9it9z.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const categoryCollection = client.db("resalePort").collection("categories");
    const productCollection = client.db("resalePort").collection("products");
    const userCollection = client.db("resalePort").collection("users");

    app.get("/categories", async(req, res) => {
      const query = {};
      const categories = await categoryCollection.find(query).toArray();
      res.send(categories);
    });

    app.get("/category/:id", async(req, res) => {
      const id = req.params.id;
      const query = {
        sub_category:id
      };
      const product = await productCollection.find(query).toArray();
      res.send(product);
    });

    app.post('/users', async(req, res)=>{
      const user = req.body;
      const result = await userCollection.insertOne(user);
      console.log(result);
      res.send(result);
    })

  } finally {
  }
}
run().catch((err) => console.log("Error: ", err));



app.listen(port, () => {
  console.log(`mongodb db server is running, ${port}`);
});
