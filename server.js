const express = require('express');
require('dotenv').config();
const getPrice = require('./getPrice');

const app = express();
const PORT = process.env.PORT || 8080;

// Routes
app.get('/', function(req, res) {
    res.send('Price Monk Lives to Serve');
})
app.get('/price', async function(req, res) {
    let currency = req.query.currency.toUpperCase();
    let date = req.query.date;

    let price = await getPrice(currency, date);
    res.json(price);
})

// Start server
app.listen(PORT);
console.log(`Server is listening at port ${PORT}`);