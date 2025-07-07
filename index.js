const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config();

app.use(express.json())
app.use(cors());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qam3y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const productCollection = client.db('ecomerDB').collection('product')
        const sentCollection = client.db('ecomerDB').collection('sendProduct')

        app.get('/product', async (req, res) => {
            const result = await productCollection.find().toArray();
            res.send(result)
        })

        app.post('/product', async (req, res) => {
            try {
                const product = req.body;
                if (!product || !product.title || !product.price) {
                    return res.status(400).json({ error: "Missing product fields" });
                }

                const result = await productCollection.insertOne(product);
                res.status(201).json({
                    message: "✅ Product added successfully",
                    insertedId: result.insertedId,
                });
            } catch (error) {
                res.status(500).json({ error: "❌ Failed to add product" });
            }
        });
        app.post('/sendProduct', async (req, res) => {
            try {
                const product = req.body;

                if (!product || !product.name || !product.email || !product.address) {
                    return res.status(400).json({ message: "Missing fields in order data" });
                }

                const result = await sentCollection.insertOne(product);
                res.status(200).json(result);
            } catch (error) {
                console.error("Insert Error:", error);
                res.status(500).json({ message: "Failed to place order" });
            }
        });




        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
