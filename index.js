const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8cly1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 4000;



app.get('/', (req, res) => {
  res.send('db successfilly working')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
client.connect(err => {
  const ProductsCollection = client.db("emajonProduct").collection("products");
  const OrdersCollection = client.db("emajonProduct").collection("Order");
  
  app.post('/addProducts', (req, res) => {
      const Products = req.body;
      ProductsCollection.insertOne(Products)
    .then(result =>{
        console.log(result)
        res.send(result.insertedCount > 0)
    })
  })


  app.get('/allProducts', (req, res) => {
    const search = req.query.search;
    ProductsCollection.find({name: {$regex: search}})
  .toArray((err, documents) => {
      res.send(documents)
  })
})


app.get('/Product/:key', (req, res) => {
    ProductsCollection.find({key: req.params.key})
  .toArray((err, documents) => {
      res.send(documents)
  })
})


app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    ProductsCollection.find({key: { $in: productKeys}})
    .toArray( (err, documents) => {
        res.send(documents)
    })
})


app.post('/addOrder', (req, res) => {
    const OrderInfo = req.body;
    OrdersCollection.insertOne(OrderInfo)
  .then(result =>{
      console.log(result)
      res.send(result.insertedCount > 0)
  })
})



});

app.listen(port, () => {
  console.log(`successfully listening at http://localhost:${port}`)
})