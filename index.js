const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const advertisedCollection = client.db("resalePort").collection("advertised");

    app.get("/categories", async (req, res) => {
      const query = {};
      const categories = await categoryCollection.find(query).toArray();
      res.send(categories);
    });

    app.get("/singleCategory", async (req, res) => {
      const category = req.query.category;
      const query = { category_name: category };
      const result = await categoryCollection.findOne(query);
      res.send(result);
    });

    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        sub_category: id,
      };
      const product = await productCollection.find(query).toArray();
      res.send(product);
    });

    app.get("/user", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    app.get("/myProducts", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const products = await productCollection.find(query).toArray();
      res.send(products);
    });

    app.put("/myProducts/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updatedStatus = {
        $set: {
          advertised: true,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updatedStatus,
        option
      );
      console.log(result);
      res.send(result);
    });

    //advertisedProducts
    app.get("/advertisedProducts", async (req, res) => {
      const query = {};
      const products = await advertisedCollection.find(query).toArray();
      res.send(products);
    });

    app.post("/advertisedProducts", async(req, res)=>{
      const product = req.body;
      const result = await advertisedCollection.insertOne(product);
      res.send(result);
    });


    app.post("/product", async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const alreadyUser = await userCollection.findOne(query);
      if (alreadyUser?.email === user?.email) {
        res.send({ message: "already a registered user" });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.log("Error: ", err));



app.listen(port, () => {
  console.log(`mongodb db server is running, ${port}`);
});
