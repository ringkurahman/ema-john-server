const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.extbg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(cors());
app.use(bodyParser.json());

client.connect(err => {
    const dbProducts = client.db('emaJohnStore').collection('products');
    const ordersCollection = client.db('emaJohnStore').collection('orders');
    
    app.post('/addProduct', (req, res) => {
        const products = req.body;
        dbProducts.insertOne(products)
        .then((result) => {
          console.log(result.insertedCount);
          res.send(result.insertedCount > 0)
        });
    })

    app.get('/products', (req, res) => {
        dbProducts.find({})
            .toArray((err, documents) => {
                res.send(documents);
        })
    })

    app.get('/product/:key', (req, res) => {
        dbProducts.find({key: req.params.key})
            .toArray((err, documents) => {
        res.send(documents[0]);
      });
    });

    app.post('/productsByKeys', (req, res) => {
        const productByKeys = req.body
        dbProducts.find({ key: { $in: productByKeys } })
            .toArray((err, documents) => {
                res.send(documents)
        })
    })

    app.post('/addOrder', (req, res) => {
      const order = req.body;
        ordersCollection.insertOne(order)
            .then((result) => {
          console.log(result.insertedCount);
          res.send(result.insertedCount > 0);
        });
    });

});


app.listen(5000);