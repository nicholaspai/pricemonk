const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const getPrice = require('./getPrice');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);


// Routes
app.get('/', function(req, res) {
    res.send('Price Monk Lives to Serve');
})
app.get('/price', async function(req, res) {
    if (req.query.currency && req.query.date) {
        try {
            let currency = req.query.currency.toUpperCase();
            let date = req.query.date;        
            let price = await getPrice(currency, date);
            res.json(price);        
        } catch (err) {
            res.status(500).send('Server failed to load a price');
        }
    } else {
        res.status(400).send('Invalid "currency" and "date" parameters');
    }
})

const moment = require('moment');
app.post('/price/slack', async function (req, res) {    
    if (req.body.text) {
        try {
            let arguments = req.body.text.split(' ');
            let currency = arguments[0].toUpperCase();
            let date = arguments[1];        
            let price = await getPrice(currency, date);
            let priceVal = parseFloat(price.close);
            let priceTimestamp = moment(price.time);
            let message = (`PRICE => ${priceTimestamp}, DATE => ${priceVal.toString()}`);    
            res.send(message);      
        } catch (err) {
            res.status(500).send('Server failed to load a price');
        }
    } else {
        res.status(400).send('Invalid "currency" and "date" parameters');
    }
})

// Start server
app.listen(PORT);
console.log(`Server is listening at port ${PORT}`);