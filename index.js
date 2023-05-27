const express = require("express");
const app = express();
const { MongoClient,ServerApiVersion } = require('mongodb');
const cors = require("cors");
require("dotenv").config();
// const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s4daxap.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("toyLand");
    const toysCollection = database.collection("all-Cars");
    const usersCollection = database.collection("Users");

// Get multiple Toys from the database
app.get("/toys",async(req,res) => {
    const cursors = toysCollection.find({});
    const toys = await cursors.toArray();
    res.json(toys);
    
})

    // Put User login info in database
    app.post("/users", async (req, res) => {
        const user = req.body;
        result = await usersCollection.insertOne(user);
        res.json(result);
      });
      // check user info if found then ignore if not found then add user info to our database. this is work while use google popup login & emailPass login or register
  
      app.put("/users", async (req, res) => {
        const user = req.body;
        const filter = { email: user.email };
        const option = { upsert: true };
        const updateDoc = { $set: user };
        result = await usersCollection.updateOne(filter, updateDoc, option);
        res.json(result);
      });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Toy Car Server is running");
  });
  
  app.listen(port, () => {
    console.log(`listening at ${port}`);
  });