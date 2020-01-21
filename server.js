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
            let message = (`${priceVal} @ ${priceTimestamp.toString()}`);    
            res.json({
                response_type: "in_channel", 
                // in_channel (allows everyone in channel to see) or 
                // ephemeral (only for user)
                text: message
            });      
        } catch (err) {
            res.json({
                response_type: "ephemeral",
                text: "Sorry, that didn't work. Please try again. Remember to pass exactly two arguments separated by a space after /price: a currency (e.g. eth-usd) and a date (GMT) with the special format YYYY-MM-DDTHH:mm:ss (e.g. 2020-01-09T00:00:00)"
            });
        }
    } else {
        res.status(400).send('Oops. Remember to pass exactly two arguments separated by a space after /price: a currency (e.g. eth-usd) and a date (GMT) with the special format YYYY-MM-DDTHH:mm:ss (e.g. 2020-01-09T00:00:00)');
    }
})

// Start server
app.listen(PORT);
console.log(`Server is listening at port ${PORT}`);