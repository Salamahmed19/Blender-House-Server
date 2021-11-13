const express = require('express')
const bodyParser = require("body-parser");
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');
const app = express()

const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.asedd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const allProducts = client.db('blender-house').collection('products');
        const cartProducts = client.db('blender-house').collection('cartProducts');
        const users = client.db('blender-house').collection('users');
        const allReviews = client.db('blender-house').collection('reviews');

        // Add product from admin
        app.post("/addproduct", async (req, res) => {
            const result = await allProducts.insertOne(req.body);
        });

        app.post("/users", async (req, res) => {
            const result = await users.insertOne(req.body);
            res.json(result);
        });

        app.put("/users", async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await users.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        // Display products from server
        app.get("/allproducts", async (req, res) => {
            const result = await allProducts.find({}).toArray();
            res.send(result);
        });

        app.get("/allreviews", async (req, res) => {
            const result = await allReviews.find({}).toArray();
            res.send(result);
        });

        app.get("/users", async (req, res) => {
            const result = await users.find({}).toArray();
            res.send(result);
        });

        app.get("/users/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await users.findOne(query)
            let isAdmin = false;
            if (user?.status === "Admin") {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });

        // Display products from server
        app.get("/cartProduct", async (req, res) => {
            const result = await cartProducts.find({}).toArray();
            res.send(result);
        });

        //delete products from admin
        app.delete("/deleteproduct/:id", async (req, res) => {
            const query = { _id: ObjectId(req.params.id) };
            const result = await allProducts.deleteOne(query);
            res.send(result);
        });

        app.delete("/cancelproduct/:id", async (req, res) => {
            const query = { _id: ObjectId(req.params.id) };
            const result = await cartProducts.deleteOne(query);
            res.send(result);
        });

        app.delete("/deleteorder/:id", async (req, res) => {
            const query = { _id: ObjectId(req.params.id) };
            const result = await cartProducts.deleteOne(query);
            res.send(result);
        });

        // getting product with product id
        app.get("/cartProduct/:id", async (req, res) => {
            const query = { _id: ObjectId(req.params.id) };
            const result = await allProducts.findOne(query);
            res.send(result);
        });

        // getting product with product id
        app.get("/updateProduct/:id", async (req, res) => {
            const query = { _id: ObjectId(req.params.id) };
            const result = await allProducts.findOne(query);
            res.send(result);
        });

        // getting product with email quary
        app.get("/mycart", async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await cartProducts.find(query).toArray();
            res.send(result);
        });

        // getting product with product id
        app.post("/cartProduct", async (req, res) => {
            const result = await cartProducts.insertOne(req.body);
        });

        app.post("/reviewProduct", async (req, res) => {
            const result = await allReviews.insertOne(req.body);
        });

        //update status from admins
        app.put('/updatestatus', async (req, res) => {
            const data = (req.body)
            console.log(data)
            const updatedStatus = "Done & Collected";
            const filter = { _id: ObjectId(req.body._id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedStatus
                },
            };
            const result = await cartProducts.updateOne(filter, updateDoc, options)
            res.send(result)
        })
        app.put('/updateuser', async (req, res) => {
            const data = (req.body)
            const updatedStatus = "Admin";
            const filter = { _id: ObjectId(req.body._id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedStatus
                },
            };
            const result = await users.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        app.put('/removeadmin', async (req, res) => {
            const data = (req.body)
            const updatedStatus = "Normal";
            const filter = { _id: ObjectId(req.body._id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedStatus
                },
            };
            const result = await users.updateOne(filter, updateDoc, options)
            res.send(result)
        })


        // //update product from admin
        app.put('/updateProduct/:id', async (req, res) => {
            const updatedProduct = req.body;
            const filter = { _id: ObjectId(req.params.id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedProduct.name,
                    band: updatedProduct.band,
                    imageUrl: updatedProduct.imageUrl,
                    price: updatedProduct.price,
                    warranty: updatedProduct.warranty,
                    madeIn: updatedProduct.madeIn,
                    capacity: updatedProduct.capacity
                },
            };
            const result = await allProducts.updateOne(filter, updateDoc, options)
            res.send(result)
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log("I am from port", port)
})